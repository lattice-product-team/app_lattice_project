## Why

The current microservices architecture (Auth, Geo, Social, Gateway) is causing unnecessary resource overhead and complexity for the current scale of the Lattice project. Unifying these into a single monolithic API service will reduce memory usage, simplify networking (eliminating internal proxying), and accelerate CI/CD build and deployment cycles, making it more suitable for self-hosted Proxmox environments with limited resources.

## What Changes

- **Monolithic API Service**: Merge Auth, Geo, and Social logic into a single `api` service.
- **Internal Communication Removal**: Eliminate the internal HTTP proxying from the Gateway to sub-services. All logic will now be handled within the same process.
- **Service Consolidation**: Remove individual service `Dockerfiles` and `docker-compose` definitions for the individual backend units.
- **CI/CD Optimization**: Update the GitHub Actions pipeline to build only two images: `api` and `admin-web`.
- **Infrastructure Cleanup**: Remove redundant environment variables and networking configurations required for inter-service communication.

## Capabilities

### New Capabilities

- `monolithic-api-architecture`: Defines the consolidated structure of the Lattice backend.

### Modified Capabilities

- `ci-cd-standards`: Update to reflect the simplified two-service deployment model.

## Impact

- **Affected Services**: `gateway`, `auth`, `geo`, `social` will be consolidated into `api`.
- **Infrastructure**: `docker-compose.yml`, `deploy-backend.yml`, and local development scripts.
- **Networking**: All backend traffic will now target a single internal service on a shared port.
