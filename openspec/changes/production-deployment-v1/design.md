## Context

The Lattice project is moving to a production environment hosted on a Proxmox virtualized infrastructure. The networking is managed via a global NGINX instance and Cloudflare Tunnels, with services exposed under the `projects.kore29.com` domain using subpath routing. The database resides on a separate VM within the same local network.

## Goals / Non-Goals

**Goals:**

- Implement a two-phase CI/CD pipeline (Quality Check -> Build & Deploy).
- Configure `admin-web` and `gateway` for correct operation under subpaths (`/lattice/web-admin` and `/lattice/api`).
- Ensure secure and persistent connectivity to the production PostgreSQL instance.
- Standardize the use of GitHub Secrets for all environment variables.

**Non-Goals:**

- Manual configuration of the Proxmox hypervisor or VM OS.
- Setup of the NGINX global proxy or Cloudflare Tunnels (external to the repo).

## Decisions

### 1. Subpath Routing Strategy

- **Admin Dashboard**: We will use Next.js `basePath` configuration. This ensures that all internal links, script tags, and asset requests are automatically prefixed with `/lattice/web-admin`.
- **API Gateway**: The Gateway will be configured to handle the `/lattice/api` prefix. We will verify if the NGINX proxy strips this prefix or passes it through; our implementation will support a configurable `BASE_PATH` environment variable to remain flexible.

### 2. CI/CD Pipeline Architecture

- **Phase 1: Quality (GitHub Hosted)**: Runs on `ubuntu-latest`. Responsible for Linting, TypeChecking, and running tests against a containerized PostGIS instance. This ensures no broken code reaches the server.
- **Phase 2: Deploy (Self-Hosted)**: Runs on the user's `self-hosted` runner. Responsible for:
  - Pulling the latest code.
  - Building production Docker images.
  - Running database migrations.
  - Restarting services via Docker Compose.

### 3. Database Connectivity

- We will use the direct private IP `192.168.1.57` in the `DATABASE_URL`.
- The `docker-compose.prod.yml` will be updated to ensure that containers can reach the host/external network (likely via the existing `red_proxy` network or by ensuring the Docker bridge has appropriate routing).

### 4. Mobile Deployment (EAS)

- We will document/script the usage of `eas build --platform all` to ensure that mobile artifacts are generated using Expo's cloud infrastructure, keeping the local server free from heavy native build loads.

## Risks / Trade-offs

- **[Risk] NGINX Subpath Asset Collisions** → **[Mitigation]** Strictly use `basePath` in Next.js and avoid hardcoded absolute paths in the frontend.
- **[Risk] Private IP Changes** → **[Mitigation]** Use a GitHub Secret for the `DATABASE_URL` so it can be updated without code changes if the Proxmox VM IP changes.
- **[Risk] Docker Build Time on Self-Hosted** → **[Mitigation]** Use Docker layer caching and ensure the runner has sufficient resources allocated in Proxmox.
