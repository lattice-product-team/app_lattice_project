# Troubleshooting

Common issues and their solutions when developing for Lattice.

## 1. Database Connectivity

### Error: "Failed to connect to PostgreSQL"
- **Cause**: Docker container is not running or the port `5432` is occupied.
- **Fix**: Run `docker ps` to ensure the container is up. If port 5432 is busy, stop any local Postgres instances.

### Error: "Relation 'events' does not exist"
- **Cause**: Migrations haven't been run.
- **Fix**: Run `pnpm --filter @app/db db:migrate`.

---

## 2. Monorepo & Dependencies

### Error: "Cannot find module '@app/core'"
- **Cause**: Turborepo hasn't built the shared package.
- **Fix**: Run `pnpm build` from the root or `pnpm --filter @app/core build`.

### Issue: "pnpm install takes too long"
- **Tip**: Ensure you are using the latest version of pnpm. You can also try clearing the cache: `pnpm store prune`.

---

## 3. Mobile App (Expo/React Native)

### Issue: "White screen on simulator"
- **Cause**: Usually a bundling error or the API is unreachable.
- **Fix**: Press `r` in the Expo terminal to reload. Check the logs for any `Network Request Failed` errors.

### Issue: "Map not rendering"
- **Cause**: Missing API key or no internet connection.
- **Fix**: Ensure your local `.env` has a valid MapLibre or Mapbox token if required.

---

## 4. Admin Dashboard

### Error: "Hydration failed"
- **Cause**: React server-side rendering mismatch.
- **Fix**: This usually happens if you use browser-only globals (like `window`) outside of `useEffect`. Check the component where the error originates.

---

## Still stuck?
If your issue isn't listed here, please open a thread in the `#engineering-help` channel with:
1. A screenshot of the error.
2. What you were trying to do.
3. Your OS and Node version.
