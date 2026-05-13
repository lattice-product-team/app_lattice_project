## 1. Preparation

- [x] 1.1 Create `src` directory in `apps/server/api` if it doesn't exist
- [x] 1.2 Copy `index.ts` and `app.ts` into `apps/server/api/src/` (or verify they are already there)
- [x] 1.3 Move `apps/server/auth` source folders (controllers, routes, etc.) into `apps/server/api/src/auth/`
- [x] 1.4 Move `apps/server/geo` source folders into `apps/server/api/src/geo/`
- [x] 1.5 Move `apps/server/social` source folders into `apps/server/api/src/social/`

## 2. Dependency Consolidation

- [x] 2.1 Merge dependencies from `auth`, `geo`, and `social` into `apps/server/api/package.json`
- [x] 2.2 Remove `@app/auth`, `@app/geo`, and `@app/social` from `apps/server/api/package.json`
- [x] 2.3 Run `pnpm install` in the root to update the lockfile

## 3. Code & Config Updates

- [x] 3.1 Update all imports in `apps/server/api/src/` to use relative paths (e.g., `./auth/...`)
- [x] 3.2 Update `apps/server/api/tsconfig.json` to include the new folders and remove old references
- [x] 3.3 Update `Dockerfile` to a simplified version that only builds and runs `@app/api`
- [x] 3.4 Revert `package.json` `exports` and `tsconfig` paths hacks (no longer needed)

## 4. Cleanup & Verification

- [ ] 4.1 Delete the now-empty directories: `apps/server/auth`, `apps/server/geo`, `apps/server/social`
- [ ] 4.2 Run `docker compose up --build` and verify logs
- [ ] 4.3 Verify the API responds at `projects.kore29.com/lattice/api/v1/health`
