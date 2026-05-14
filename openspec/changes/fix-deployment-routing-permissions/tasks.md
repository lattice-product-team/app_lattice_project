## 1. API Routing Refactor

- [x] 1.1 Update `app.ts` to mount `v1Router` at the root (`/`)
- [x] 1.2 Remove legacy versioned mount points (`/api/v1`, `/v1`, `/api`) from `app.ts`
- [x] 1.3 Verify that all module routes (Auth, Geo, Social) are accessible without prefixes

## 2. Admin Web Hardening

- [x] 2.1 Update `next.config.ts` to hardcode `basePath: '/lattice/web-admin'`
- [x] 2.2 Refactor `logout` and `login` redirects in `actions.ts` to use relative paths
- [x] 2.3 Verify internal navigation respects the base path in production

## 3. Production Infrastructure (Docker)

- [x] 3.1 Update `docker-compose.prod.yml` with `user: "1000:1000"` for all application services
- [x] 3.2 Add `tile_urls` environment variable to Valhalla in `docker-compose.prod.yml`
- [x] 3.3 Ensure all production containers have explicit `container_name` and `networks` mapping

## 4. Verification and Deployment

- [x] 4.1 Perform a clean build to verify permissions fix
- [x] 4.2 Validate Nginx routing for API and Admin Web with new unversioned paths
- [x] 4.3 Verify Valhalla map provisioning logs on startup
