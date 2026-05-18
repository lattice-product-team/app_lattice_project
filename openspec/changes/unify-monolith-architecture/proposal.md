## Why

The current architecture splits the server into multiple workspace packages (`api`, `auth`, `geo`, `social`) that logically function as a single monolith. This fragmentation has caused severe issues with module resolution in Docker/production environments, brittle path mappings, and complex deployment configurations. Unifying these into a single package will eliminate these technical hurdles and simplify development.

## What Changes

- **Move Code**: Consolidate `apps/server/auth`, `apps/server/geo`, and `apps/server/social` source code into the `apps/server/api/src/` directory.
- **Merge Dependencies**: Merge the `package.json` dependencies of the fragmented services into a single `@app/api` package.
- **Simplify Build**: Update the build process to use a single `tsconfig` and a simplified `Dockerfile`.
- **Remove Redundant Packages**: Delete the empty sibling package directories in `apps/server/`.
- **Update Imports**: Change all cross-service imports from workspace package names (`@app/auth`) or brittle relative paths back to standard local relative paths.

## Capabilities

### New Capabilities

- `unified-server-architecture`: A single, robust entry point for all server-side logic that is easy to build, test, and deploy.

### Modified Capabilities

- `deployment-infrastructure`: The Docker and Nginx configurations will be significantly simplified.

## Impact

- **Codebase Structure**: Major reorganization of `apps/server/`.
- **Dependencies**: Centralization of server-side dependencies.
- **Build/CI**: Deployment scripts and Dockerfiles will need updates.
- **Stability**: Significant increase in runtime stability by removing ESM module resolution complexity.
