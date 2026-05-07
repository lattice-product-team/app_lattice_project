## Why

The current environment configuration is fragmented across multiple `.env` files and hardcoded values in Docker Compose and GitHub Actions. This leads to configuration drift, security risks (hardcoded credentials), and manual friction when switching between local and Dockerized development environments.

## What Changes

- **Single Source of Truth**: Consolidate all environment variables into a single root `.env` file.
- **Environment Synchronization**: Implement an automated script to sync required variables to the mobile app with the mandatory `EXPO_PUBLIC_` prefix.
- **Dynamic Networking**: Replace hardcoded service URLs with dynamic host variables (`AUTH_HOST`, etc.) to support Local, Docker, and Production environments without code changes.
- **Secret-Driven Deployment**: Refactor GitHub Actions to inject secrets directly into Docker Compose environments (Option A), eliminating fragile `.env` file generation.
- **Turbo Cache Integrity**: Update Turbo configuration to track the `.env` file, ensuring cache hits are environment-consistent.

## Capabilities

### New Capabilities

- `env-synchronization`: Tooling to manage and distribute environment variables from the root SSOT to sub-packages, specifically handling Expo's prefix requirements.
- `cross-environment-networking`: A standard pattern for service discovery/networking that works across local development, Docker Compose, and production containers.

### Modified Capabilities

- `standards-alignment/ci-cd`: Updating the deployment pipeline to prioritize direct secret injection over file-based configuration.

## Impact

- **Affected Code**: Entry points for all server apps (`gateway`, `auth`, `geo`, `social`), `apps/mobile/package.json`.
- **Infrastructure**: `docker-compose.yml`, `docker-compose.prod.yml`, `.github/workflows/deploy-backend.yml`.
- **Developer Experience**: Root `package.json` scripts and `turbo.json`.
