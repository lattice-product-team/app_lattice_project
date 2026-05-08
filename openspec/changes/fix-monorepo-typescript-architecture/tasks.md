## 1. Root & Shared Package Infrastructure

- [x] 1.1 Update root `tsconfig.json` to Solution Style (files: [], references to all packages).
- [x] 1.2 Restore `paths` in root `tsconfig.json` for development source-to-source resolution.
- [x] 1.3 Update `packages/core/tsconfig.json` to be composite and use `bundler` resolution.
- [x] 1.4 Update `packages/db/tsconfig.json` to be composite and use `bundler` resolution.
- [x] 1.5 Update `packages/types-schema/tsconfig.json` to be composite and use `bundler` resolution.

## 2. Package Cleanup & Exports

- [x] 2.1 Remove explicit `.js` extensions from imports in `packages/db` and verify resolution.
- [x] 2.2 Standardize `package.json` for all shared packages (main/types pointing to dist, type: module).

## 3. Service Configuration

- [x] 3.1 Update `apps/server/gateway/tsconfig.json` to use `bundler` resolution and correct project references.
- [x] 3.2 Update `apps/server/auth/tsconfig.json` similarly.
- [x] 3.3 Update `apps/server/geo/tsconfig.json` similarly.
- [x] 3.4 Update `apps/server/social/tsconfig.json` similarly.

## 4. Docker & CI/CD Validation

- [x] 4.1 Update `Dockerfile` to use `pnpm tsc --build` for the compilation phase.
- [x] 4.2 Verify the full build chain passes locally with a single root command.
