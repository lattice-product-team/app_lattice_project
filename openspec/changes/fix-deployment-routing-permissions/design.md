## Context

The current production deployment suffers from inconsistent routing prefixes and permission conflicts. Nginx is configured to strip prefixes, which creates a mismatch with the API monolith's internal routing. Additionally, Docker containers running as `root` create files that the host runner cannot manage, breaking the CI/CD pipeline.

## Goals / Non-Goals

**Goals:**

- Unify and simplify API routing by removing versioned prefixes.
- Align Nginx and Application routing to prevent 404 errors.
- Resolve host-to-container permission conflicts.
- Automate Valhalla map data provisioning.

**Non-Goals:**

- Refactoring the API business logic.
- Implementing new features beyond routing and infrastructure.
- Migrating the database schema.

## Decisions

### 1. Simplified API Routing (Root-Relative)

- **Decision**: Mount the `v1Router` at the root (`/`) of the Express application.
- **Rationale**: Removes the need for complex Nginx prefix stripping and makes the API internal logic simpler.
- **Alternatives**: Keeping `/v1` would require Nginx to be perfectly synced with the versioning, which has proven fragile in this multi-app setup.

### 2. User Mapping in Docker

- **Decision**: Set `user: "1000:1000"` in `docker-compose.prod.yml`.
- **Rationale**: This matches the UID/GID of the `kore` user on the host runner, ensuring that any files created (like Next.js build artifacts) are deletable by the runner.

### 3. Transparent Nginx Proxying

- **Decision**: Configure Nginx `proxy_pass` to pass the full path when appropriate, but maintain the `/lattice/api` to `/` mapping for the API.
- **Rationale**: Next.js `basePath` works best when it sees the full prefixed URL, while the API benefits from a clean root-level mount.

### 4. Automated Map Provisioning

- **Decision**: Use the `tile_urls` environment variable in the Valhalla container.
- **Rationale**: Eliminates the manual step of downloading `.pbf` files to the server.

## Risks / Trade-offs

- **[Risk]**: Clients using the old `/v1` endpoint will break.
- **[Mitigation]**: Update `NEXT_PUBLIC_API_URL` and all internal links. The current user is the primary consumer of this API.
- **[Risk]**: Next.js redirects in Server Actions bypassing `basePath`.
- **[Mitigation]**: Use relative redirects (`./login`) or explicit paths within the action logic.
