## 1. Expo Configuration Fix

- [ ] 1.1 Remove `web.output: static` from `apps/mobile/app.json` to stop SSR crashes.
- [ ] 1.2 Ensure `babel.config.js` and `metro.config.js` are optimized for development builds.

## 2. Smart Connectivity & Diagnostics

- [ ] 2.1 Refactor `scripts/sync-env.ts` to allow dynamic `GATEWAY_HOST` override without touching root `.env`.
- [ ] 2.2 Create a diagnostic script to check port 3000 and 8081 reachability on the Hotspot IP.
- [ ] 2.3 Update `apps/mobile/package.json` with a unified `dev:lan` command that runs diagnostics before starting.

## 3. Code Cleanup

- [ ] 3.1 Revert the "safe mock" hacks in `MapContent.tsx`, `offlineService.ts`, and `storage.ts` (they won't be needed once SSR is off).
- [ ] 3.2 Verify the "0 kb" download error is resolved by forcing correct interface binding.

## 4. Verification & Build Flow

- [ ] 4.1 Test full connectivity from a physical iPhone via Hotspot.
- [ ] 4.2 Document the `eas build --local` command for generating standalone apps.
