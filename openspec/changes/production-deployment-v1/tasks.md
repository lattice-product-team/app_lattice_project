## 1. Subpath Routing & Web Config

- [x] 1.1 Configure `admin-web` with `basePath: '/lattice/web-admin'` in `next.config.ts`.
- [x] 1.2 Update `gateway` to support a configurable `BASE_PATH` (e.g., `/lattice/api`) and handle path prefixing.
- [x] 1.3 Ensure `NEXT_PUBLIC_API_URL` and other public variables are correctly set for production in the environment schema.

## 2. CI/CD Pipeline Refactoring

- [x] 2.1 Refactor `.github/workflows/deploy-backend.yml` into a two-phase pipeline (Quality Phase on GitHub runner, Deploy Phase on self-hosted runner).
- [x] 2.2 Configure the self-hosted runner job with correct labels (`self-hosted`, `Linux`, `X64`).
- [x] 2.3 Optimize the Docker build process on the self-hosted runner (layer caching, prune steps).

## 3. Infrastructure & Secrets

- [x] 3.1 Update `docker-compose.prod.yml` to align with the Proxmox networking environment and ensure service discovery.
- [x] 3.2 Implement a database connectivity check script to verify access to `192.168.1.57` from within containers.
- [x] 3.3 Verify all required production secrets are documented and ready for injection into GitHub Secrets.

## 4. Mobile & Final Verification

- [ ] 4.1 Prepare the `eas.json` and build scripts for the production mobile app deployment.
- [ ] 4.2 Perform a smoke test of the entire subpath routing chain (Cloudflare -> NGINX -> Docker Gateway).
- [ ] 4.3 Finalize the deployment and verify service health across all sub-services.
