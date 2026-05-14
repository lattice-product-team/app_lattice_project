## Why

The production environment is currently experiencing critical failures due to misaligned Nginx routing, DNS resolution errors between containers, and permission conflicts between Docker root-owned files and the self-hosted GitHub Actions runner. Additionally, the existing `/v1` API prefix adds unnecessary complexity to the simplified monolith architecture. Fixing these issues is required to achieve a stable, professional deployment state.

## What Changes

- **BREAKING**: Remove the `/v1` prefix from all API routes to simplify the unified gateway.
- **BREAKING**: Standardize the Nginx routing to pass full paths to applications without stripping prefixes, ensuring consistency between browser and server.
- **MODIFICATION**: Configure production Docker containers to run as a non-root user (`1000:1000`) to resolve permission conflicts with the host runner.
- **MODIFICATION**: Harden `admin-web` Next.js configuration to force `basePath` and ensure Server Action redirects remain within the application context.
- **MODIFICATION**: Update `docker-compose.prod.yml` to include Valhalla map bootstrapping and remove legacy local database dependencies.

## Capabilities

### New Capabilities
- `automated-map-provisioning`: Automatic download and build of OSM tiles during container startup via `tile_urls`.

### Modified Capabilities
- `cross-environment-networking`: Align production networking with the `red_proxy` external network and explicit container naming.
- `monolithic-api-architecture`: Simplify the monolith entry point by removing versioned prefixes and unifying route mounting.
- `ci-cd-standards`: Update deployment requirements to handle host-user permission mapping.

## Impact

This change affects the global Nginx configuration, the production Docker Compose orchestration, the API monolith routing logic, and the Admin Web's authentication and navigation system. It will result in a more resilient and maintainable deployment pipeline.
