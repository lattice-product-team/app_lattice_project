import { Callout } from 'nextra/components'

# Deployment Guide

This manual covers the production deployment architecture and orchestration for the Lattice ecosystem. It is intended for DevOps, SysAdmins, and Release Engineers responsible for maintaining staging or production environments.

---

## 1. Production Architecture Overview

The Lattice platform uses a modern, containerized architecture that segregates frontend client assets, backend telemetry processing, real-time routing engines, and data caching.

```mermaid
graph TD
    User([End User / Mobile Client]) -->|HTTPS / WSS| Nginx[Nginx Reverse Proxy / SSL]
    Admin([Platform Operator]) -->|HTTPS| Nginx

    subgraph "Containerized Application Cluster (Docker Compose)"
        Nginx -->|Port 3004| Next[Next.js Admin Dashboard]
        Nginx -->|Port 3000| Express[Express Backend API]
        Express -->|Caching / Session| Redis[Redis Container]
        Express -->|Routing / GIS| Valhalla[Valhalla Routing Engine]
    end

    subgraph "Managed Cloud Layer"
        Express -->|PostgreSQL Protocol| ManagedDB[(Managed PostgreSQL + PostGIS)]
    end
```

### Deployment Guidelines

- **Frontend (Admin Dashboard)**: Containerized Next.js server running in standalone mode behind Nginx, or deployed directly to an edge hosting platform like Vercel.
- **Backend (API Server)**: Lightweight Express application containerized and horizontally scaled.
- **Routing (Valhalla)**: Dedicated container loaded with OSM (OpenStreetMap) regional extracts.
- **Caching (Redis)**: High-speed key-value cache containerized with strict memory persistence policies.
- **Database (PostgreSQL)**: **Never deploy database containers to production host servers.** Always use a managed database service.

---

## 2. Production Database Provisioning

Lattice requires **PostgreSQL 15+** with the **PostGIS 3.3+** extension.

### Recommended Services

- Amazon RDS (PostgreSQL with PostGIS engine support)
- Google Cloud SQL
- Supabase or Neon (Serverless Postgres)

### DB Initialization Steps

1.  **Create the Database Instance**: Provision a multi-AZ instance for high availability.
2.  **Enable Connection Pooling**: Due to high concurrency from mobile telemetry tracking, use a connection pooler like **PgBouncer** (usually built-in or enabled on cloud providers).
3.  **Execute Extensions**: Connect to your database instance via an admin client and enable the extension:
    ```sql
    CREATE EXTENSION postgis;
    ```
4.  **Secure the Network**: Restrict database inbound traffic (Port 5432) so that only the IP addresses of your API containers can establish a connection.
5.  **Backup Policy**: Set automated daily snapshots with a minimum retention period of 7 days.

---

## 3. Building and Publishing Container Images

Lattice uses a multi-stage `Dockerfile` to build lightweight, production-ready Docker images.

```bash
# Build the production target for API
docker build --target api-prod -t ghcr.io/your_org/app_lattice_project/api:latest .

# Build the production target for Admin Web
docker build --target admin-web-prod -t ghcr.io/your_org/app_lattice_project/admin-web:latest .
```

### Publishing Images to GHCR

Ensure you are logged into the GitHub Container Registry:

```bash
echo $CR_PAT | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin

# Push images
docker push ghcr.io/your_org/app_lattice_project/api:latest
docker push ghcr.io/your_org/app_lattice_project/admin-web:latest
```

---

## 4. Production Orchestration (Docker Compose)

Lattice provides a `docker-compose.prod.yml` template designed to run the application components on a production host virtual machine.

### Environment Setup (`.env.prod`)

Create a production environment file (`.env.prod`) on the server:

```ini
# Production Environment
NODE_ENV=production
JWT_SECRET=a_very_long_cryptographically_secure_random_string

# Networking
API_PORT=3000
ALLOWED_ORIGINS=https://admin.yourdomain.com,https://api.yourdomain.com

# Managed Production DB (e.g. AWS RDS or Supabase)
DATABASE_URL=postgres://db_user:db_password@rds-instance-endpoint:5432/lattice_db

# Admin Initial Credentials (if running seeds)
ADMIN_EMAIL=security-admin@yourdomain.com
ADMIN_PASSWORD=change-me-immediately-on-first-login
```

### Orchestration Commands

Deploy the cluster using the production configuration:

```bash
# Create the external network for reverse proxy mapping (if not already present)
docker network create red_proxy

# Start the cluster in detached mode
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d
```

### Valhalla Auto-Build in Production

In `docker-compose.prod.yml`, the Valhalla service is configured to automatically download regional data on startup:

```yaml
environment:
  - tile_urls=https://download.geofabrik.de/europe/spain/cataluna-latest.osm.pbf
  - build_tiles=True
  - build_admins=True
  - build_timezones=True
  - force_rebuild=True
```

<Callout type="info">
  During the first start, Valhalla will download Catalonia's latest OpenStreetMap file and compile it into high-performance routing tiles. Depending on the CPU capacity of your host server, this can take 5–15 minutes. Routing requests will return a `503 Service Unavailable` status until the build completes.
</Callout>

---

## 5. Nginx Reverse Proxy & SSL Setup

We recommend setting up Nginx as a reverse proxy on the host server to handle SSL/TLS termination, secure cookies, and route filtering.

### Nginx Server Block (`/etc/nginx/sites-available/lattice`)

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

### Installing SSL Certificates (Certbot)

Obtain certificates automatically using Let's Encrypt:

```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdomain.com -d admin.yourdomain.com
```

---

## 6. Mobile Application Distribution

Lattice uses **Expo Application Services (EAS)** for building and publishing native mobile clients to Google Play and Apple App Store.

### Step 1: Configure `eas.json`

Ensure `eas.json` is configured in the root directory for your build environments (development, preview, production).

### Step 2: Build the Production Bundle

To trigger a secure cloud build for Android and iOS:

```bash
# Trigger cloud compilation for Android (.aab)
pnpm build:mobile:cloud

# Trigger cloud compilation for iOS (.ipa)
cd apps/mobile && eas build --platform ios --profile production
```

### Step 3: Submission to App Stores

Submit the compiled binaries to developer accounts:

```bash
cd apps/mobile
# Submit Android app
eas submit --platform android

# Submit iOS app
eas submit --platform ios
```

### Step 4: Over-The-Air (OTA) Updates

Lattice supports **Expo Updates**. This allows operators to push immediate JavaScript bundles, CSS theme changes, and bug fixes directly to users' phones without going through the slow App Store review cycle.

To deploy a quick OTA update:

```bash
cd apps/mobile
eas update --branch production --message "Hotfix: updated active event map style"
```

---

## 7. Monitoring and Maintenance

1.  **Health Check Endpoint**: Set up external uptime monitoring (e.g., Uptime Robot, Datadog) pointing to `https://api.yourdomain.com/api/v1/status`.
2.  **Log Management**: Use Docker's `json-file` logging driver with limit options to prevent disk overflow:
    ```yaml
    logging:
      driver: 'json-file'
      options:
        max-size: '10m'
        max-file: '3'
    ```
3.  **CI/CD Automation**: Deploy using GitHub Actions to automate the build-push-deploy sequence on merging to the `main` branch.
