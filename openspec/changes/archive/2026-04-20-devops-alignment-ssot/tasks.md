## 1. Environment Consolidation (SSOT)

- [x] 1.1 Create the unified root `.env.example` with all necessary variables and clear section headers.
- [x] 1.2 Implement `scripts/sync-env.ts` to synchronize root `.env` variables to `apps/mobile/.env` with the `EXPO_PUBLIC_` prefix.
- [x] 1.3 Add `env:sync` script to the root `package.json` and as a pre-step in `apps/mobile/package.json`'s dev scripts.
- [x] 1.4 Remove redundant `.env` and `.env.example` files from sub-packages to prevent configuration drift.

## 2. Service Refactoring (Dynamic Networking)

- [x] 2.1 Refactor `apps/server/gateway/index.ts` to use dynamic host variables (`AUTH_HOST`, `GEO_HOST`, etc.) and standardize environment loading.
- [x] 2.2 Refactor `apps/server/auth/index.ts` to use dynamic host variables and standardize environment loading.
- [x] 2.3 Refactor `apps/server/geo/index.ts` to use dynamic host variables and standardize environment loading.
- [x] 2.4 Refactor `apps/server/social/index.ts` to use dynamic host variables and standardize environment loading.

## 3. Infrastructure & CI/CD Alignment

- [x] 3.1 Update `docker-compose.yml` to remove hardcoded credentials and URLs, using variables from the root `.env`.
- [x] 3.2 Update `docker-compose.prod.yml` to standardize service names (matching dev where possible) and use host-based networking.
- [x] 3.3 Refactor `.github/workflows/deploy-backend.yml` to inject secrets directly into Docker Compose environments (Option A) and remove manual `.env` file generation.
- [x] 3.4 Update `turbo.json` to include `.env` in `globalDependencies` for environment-aware caching.

## 4. Verification & Validation

- [x] 4.1 Verify that `pnpm env:sync` correctly generates the mobile environment file.
- [x] 4.2 Verify that the application starts and services communicate correctly in local development mode.
- [x] 4.3 Verify that `docker compose up` works correctly using the new environment structure.
- [x] 4.4 Run a validation check on the updated GitHub Action workflow to ensure it correctly maps all required secrets.
