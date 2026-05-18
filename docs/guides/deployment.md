import { Callout } from 'nextra/components'

# Deployment Guide

This manual covers the production deployment architecture, container orchestration, SSL proxy configurations, and mobile store distribution pipelines for the Lattice ecosystem.

---

## 1. Production Architecture Overview

Lattice is structured as a containerized cluster designed to handle thousands of concurrent client telemetry connections while maintaining strict database isolation:

```mermaid
graph TD
    classDef client fill:#E1F5FE,stroke:#039BE5,stroke-width:1px;
    classDef proxy fill:#ECEFF1,stroke:#37474F,stroke-width:1px;
    classDef app fill:#EDE7F6,stroke:#5E35B1,stroke-width:1px;
    classDef db fill:#E8F5E9,stroke:#2E7D32,stroke-width:1px;

    User([Attendee / Mobile Client]):::client -->|HTTPS / WSS| Nginx[Nginx Reverse Proxy / SSL]:::proxy
    Admin([Manager / Operations]):::client -->|HTTPS| Nginx
 
    subgraph "Containerized Application Cluster (Docker Compose)"
        Nginx -->|Port 3004| Next[Next.js Admin Dashboard]:::app
        Nginx -->|Port 3000| Express[Express API Monolith]:::app
        Express -->|Port 6379| Redis[Redis Caching Container]:::app
        Express -->|Port 8002| Valhalla[Valhalla Routing Engine]:::app
    end

    subgraph "Managed Cloud Database"
        Express -->|Port 5432| ManagedDB[(PostgreSQL + PostGIS)]:::db
    end
```

### Operational Deployment Rules

*   **Next.js Admin Dashboard**: Containerized server running in standalone mode behind Nginx, or deployed directly to an edge hosting platform like Vercel.
*   **Express API Server**: Containerized Node.js application, horizontally scaled and managed by process supervisors.
*   **Redis Caching**: Highly isolated containerized Redis instance, configured with memory thresholds and strict key eviction rules.
*   **Valhalla Engine**: Heavy routing tile container, loaded with España/Cataluña OSM extracts.
*   **PostgreSQL & PostGIS Database**: **Never run your database inside container layers on your production hosts.** Always utilize managed database instances (such as AWS RDS or Google Cloud SQL) for high availability.

---

## 2. Managed Database Provisioning

Lattice requires a minimum of **PostgreSQL 15** backed by **PostGIS 3.3** or higher.

### Recommended Providers
*   Amazon RDS (PostgreSQL with PostGIS extensions active).
*   Google Cloud SQL.
*   Supabase or Neon (Serverless Postgres).

### Database Initialization Routine

1.  **Provision the Instance**: Ensure multi-AZ replication is enabled for staging/production.
2.  **Enable Connection Pooling**: Due to high-frequency telemetry GPS queries, route connections through a connection pooler like **PgBouncer** to prevent resource leaks.
3.  **Activate PostGIS Extension**: Connect to your database instance via an administrative client and run:
    ```sql
    CREATE EXTENSION postgis;
    ```
4.  **Network Security Groups**: Restrict DB inbound traffic (Port 5432) so that only the IP addresses of your API containers can establish connection tunnels.

---

## 3. Building Multi-Stage Production Images

Lattice uses multi-stage Docker builds to keep production images under 150MB by omitting devDependencies.

### 1. Build the API Monolith Image
```bash
docker build --target api-prod -t ghcr.io/your_org/app_lattice_project/api:latest .
```

### 2. Build the Next.js Web Dashboard Image
```bash
docker build --target admin-web-prod -t ghcr.io/your_org/app_lattice_project/admin-web:latest .
```

### 3. Publishing to GitHub Container Registry (GHCR)
```bash
echo $CR_PAT | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin

docker push ghcr.io/your_org/app_lattice_project/api:latest
docker push ghcr.io/your_org/app_lattice_project/admin-web:latest
```

---

## 4. Container Orchestration & Variables

Lattice provides a production-ready compose orchestrator (`docker-compose.prod.yml`) that maps service ports, links internal networks, and configures environment variables.

### Environment Schema (`.env.prod`)

Create a production environment file on your host server:
```ini
NODE_ENV=production
JWT_SECRET=a_very_long_cryptographically_secure_random_string

# Network Routing Configuration
API_PORT=3000
ALLOWED_ORIGINS=https://admin.yourdomain.com,https://api.yourdomain.com

# Managed Cloud Database Connection
DATABASE_URL=postgres://db_user:db_password@rds-instance-endpoint:5432/lattice_db

# Initial Setup Admin Credentials
ADMIN_EMAIL=security-admin@yourdomain.com
ADMIN_PASSWORD=change-me-immediately-on-first-login
```

### Orchestration Commands

To launch the production cluster, run:
```bash
# Create the external gateway network (if not present)
docker network create red_proxy

# Start the cluster in detached mode
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d
```

<Callout type="info">
  **Valhalla Data Compilation**: On initial boot, the Valhalla container downloads the Cataluña OSM extract and compiles pedestrian routing tiles. This process can take 5 to 15 minutes depending on CPU performance. Routing requests will return a `503 Service Unavailable` status until the compilation is complete.
</Callout>

---

## 5. Nginx Reverse Proxy & SSL Terminal

We recommend setting up Nginx on your host machine to terminate SSL connections, manage certs, and route traffic to the container ports.

### Nginx Site Configuration (`/etc/nginx/sites-available/lattice`)

```nginx
server {
    listen 80;
    server_name api.yourdomain.com admin.yourdomain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 443 ssl http2;
    server_name admin.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/admin.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/admin.yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3004;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Let's Encrypt SSL Installation (Certbot)
```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdomain.com -d admin.yourdomain.com
```

---

## 6. Mobile Application Distribution

Lattice uses **Expo Application Services (EAS)** to compile, sign, and submit native iOS and Android application binaries to the App Stores.

### EAS Cloud Compilations

To trigger a production-grade remote cloud compilation, run the following commands in your workspace:

```bash
# Build Android App Bundle (.aab)
pnpm build:mobile:cloud

# Build iOS App Store Package (.ipa)
cd apps/mobile && eas build --platform ios --profile production
```

### App Store Submissions
```bash
cd apps/mobile
eas submit --platform android
eas submit --platform ios
```

### Over-The-Air (OTA) Updates
Lattice is equipped with **Expo Updates**. This allows developers to push immediate bug fixes or visual adjustments directly to active mobile devices without requiring a full App Store review cycle:
```bash
cd apps/mobile
eas update --branch production --message "Hotfix: resolve MapLibre layer rendering bug"
```

---

## 7. Monitoring & System Health

1.  **Active Health Checks**: Configure external status pingers (such as Datadog or Uptime Robot) pointing directly to the `/status` and `/health` routes on the API server.
2.  **Container Logging Constraints**: Set log rotating thresholds inside your `docker-compose.prod.yml` to prevent host storage depletion:
    ```yaml
    logging:
      driver: 'json-file'
      options:
        max-size: '10m'
        max-file: '3'
    ```
3.  **CI/CD Workflows**: Link the main branches in Git to trigger automated GitHub Actions, building images and updating container clusters upon code approvals.
