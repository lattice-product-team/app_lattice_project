## 1. API Consolidation

- [x] 1.1 Rename `apps/server/gateway` to `apps/server/api` (internal folder and `package.json`).
- [x] 1.2 Update `@app/core` config to handle unified `API_PORT` (3000) and remove individual service host variables.
- [x] 1.3 Modify `apps/server/api/index.ts` to import Routers from `auth`, `geo`, and `social` instead of using proxy middleware.
- [x] 1.4 Mount all routers under `/v1` prefix in the unified `api` service.

## 2. Docker & Environment Configuration

- [x] 2.1 Refactor `Dockerfile` to have a single `api-prod` stage instead of individual service stages.
- [x] 2.2 Update root `package.json` scripts to refer to `api` instead of `gateway`.
- [x] 2.3 Update `docker-compose.yml` (local) to use only `api`, `admin-web`, `db`, `valhalla`, and `tiles` services.
- [x] 2.4 Update `docker-compose.prod.yml` (production) to reflect the same unified structure.
- [x] 2.5 Update `.env.example` to remove deprecated service host variables.

## 3. CI/CD & Infrastructure

- [x] 3.1 Update `.github/workflows/deploy-backend.yml` to build and push only the `api` image.
- [x] 3.2 Update the deployment step in the workflow to target the new `api` service.
- [x] 3.3 Verify that the NGINX configuration on the Proxmox host points to the unified API container.

## 4. Cleanup & Verification

- [x] 4.1 Remove the individual `index.ts` and `app.ts` from `auth`, `geo`, and `social` folders (they are now modules of the API).
- [x] 4.2 Run `pnpm tsc --build` to ensure all references still work.
- [x] 4.3 Verify local environment with `docker compose up --build`.
