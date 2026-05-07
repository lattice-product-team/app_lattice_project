## Why

This change is needed to transition the Lattice monorepo from development/testing to a stable production environment. The objective is to deploy all services to a self-hosted Proxmox server, utilizing GitHub Actions (self-hosted runners) for CI/CD, and ensuring that the applications are correctly reachable via a unified domain (`projects.kore29.com`) with specific subpath routing for the Admin Dashboard and the API Gateway.

## What Changes

- **Subpath Routing**: Implementation of base path routing for `admin-web` (`/lattice/web-admin`) and the `gateway` (`/lattice/api`) to support the global NGINX configuration.
- **Enhanced CI/CD Pipeline**: Refactoring the GitHub Actions workflow into a multi-phase pipeline:
    - **Build/Compile Phase**: Verification of the build integrity and generation of artifacts.
    - **Deploy Phase**: Secure transmission and deployment of containers to the self-hosted runner.
- **Infrastructure Hardening**: Configuration of Docker Compose and environment secrets to securely connect to the external PostgreSQL VM on the local Proxmox network.
- **Mobile Deployment Integration**: Formalizing the EAS (Expo Application Services) workflow for the mobile application.
- **Secrets Management**: Migration of all production secrets (Database URLs, JWT Secrets, etc.) to GitHub Secrets.

## Capabilities

### New Capabilities
- `production-infrastructure-config`: Specification of the hardware/network requirements for the self-hosted Proxmox environment and Cloudflare Tunneling.

### Modified Capabilities
- `ci-cd-standards`: Update the standard workflow to include self-hosted runner support and two-phase build/deploy logic.
- `cross-environment-networking`: Refine requirements for subpath routing, path prefixing, and cross-VM database connectivity.

## Impact

- **Affected Code**: `apps/admin-web/next.config.ts`, `apps/server/gateway/index.ts`, `packages/core/src/config.ts`.
- **Infrastructure**: `docker-compose.prod.yml`, `.github/workflows/deploy-backend.yml`.
- **Dependencies**: GitHub Secrets, EAS (Expo), Cloudflare Tunnels, NGINX.
