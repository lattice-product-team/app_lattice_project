## Context

The server is currently structured as 4 separate pnpm workspace packages in `apps/server/`. While this mimics microservices, they share the same database, core utilities, and are deployed as a single process (Monolith). This has led to complex ESM resolution issues in production.

## Goals / Non-Goals

**Goals:**

- Consolidate all server logic into a single package (`@app/api`).
- Simplify the module resolution to use standard relative paths.
- Streamline the Docker image build process.
- Maintain existing functionality and API endpoints.

**Non-Goals:**

- Refactoring the internal logic of the services (only moving files).
- Changing the database schema.
- Splitting services into actual separate deployments.

## Decisions

### 1. Folder Structure: Nested Service Directories

**Decision**: Move the source code of `auth`, `geo`, and `social` into subdirectories under `apps/server/api/src/`.

- `apps/server/api/src/auth/`
- `apps/server/api/src/geo/`
- `apps/server/api/src/social/`

**Rationale**: This keeps the code organized by domain (as it was before) but allows standard relative imports (e.g., `import ... from '../auth/...'`) to work both in development and in the compiled `dist` output.

### 2. Dependency Management: Single `package.json`

**Decision**: All server-side dependencies will be managed in `apps/server/api/package.json`.
**Rationale**: Simplifies dependency updates and ensures version consistency across all server domains.

### 3. Build Process: Standard TSC

**Decision**: Use a single `tsc --build` command for the `@app/api` package.
**Rationale**: Removes the need for complex project references between sibling server packages and the fragile `exports` mappings we had to use previously.

## Risks / Trade-offs

- **[Risk] Path Conflicts** → Mitigation: Carefully update imports during the move. The structure remains domain-driven, so naming conflicts are unlikely.
- **[Risk] Build Time** → Mitigation: Incremental compilation with `tsc` will still be fast, and the simplicity of a single package often outweighs the parallelization benefits of multiple small packages in this context.
- **[Trade-off] Loss of Package Isolation** → Mitigation: This is acceptable as the services are already logically coupled. Internal folders still provide clean domain separation.
