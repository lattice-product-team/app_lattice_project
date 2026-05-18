# Troubleshooting

Common issues and their solutions when developing for Lattice.

## 1. Database Connectivity

### Error: "Failed to connect to PostgreSQL"

- **Cause**: Docker container is not running or the port `5433` is occupied.
- **Fix**: Run `docker ps` to ensure the container is up. If port `5433` is busy, stop any local Postgres instances or modify the host port binding in `docker-compose.yml`.

### Error: "Relation 'events' does not exist"

- **Cause**: Migrations haven't been run.
- **Fix**: Run `pnpm db:migrate` and `pnpm db:seed`.

---

## 2. Monorepo & Dependencies

### Error: "Cannot find module '@app/core'"

- **Cause**: Turborepo hasn't built the shared package.
- **Fix**: Run `pnpm build` from the root.

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

## 4. Admin Dashboard

### Error: "Hydration failed"

- **Cause**: React server-side rendering mismatch.
- **Fix**: This usually happens if you use browser-only globals (like `window`) outside of `useEffect`. Check the component where the error originates.

---

## 5. Google OAuth & Deep Linking (Mobile)

### Error: "The provided Linking scheme 'com.googleusercontent.apps.xxx' does not appear in the list of possible URI schemes..."

- **Cause**: Expo's `makeRedirectUri` generates a callback URL containing your reverse Client ID scheme (which Google OAuth relies on on native Android to redirect back to the app). If this scheme is not declared in your `app.json` config under `expo.scheme`, the Metro bundler will throw a warning, and Google will block the redirect back to the app.
- **Fix**: Add the reverse Google Client ID as a scheme in your local `app.json` under `expo.scheme`. For example:
  ```json
  "scheme": [
    "lattice",
    "com.lattice.app",
    "com.googleusercontent.apps.560870004174-9hphgg5sqq69nc5hp9mn1lbsnb8ulda3"
  ]
  ```
- **Important**: Any changes to `app.json` scheme or linking intents require a native prebuild regeneration! Run `pnpm dev:android` or `npx expo prebuild --clean` to recompile the native Android manifest and registers.

### Error: "access_blocked: Lattice request is invalid (Error 400: invalid_request)"

- **Cause**: In Android native Google Sign-in or OAuth, the request SHA-1 certificate fingerprint sent by your running app does NOT match the SHA-1 fingerprint registered in the Google Cloud Console credentials under your package name (`com.lattice.app`).
- **Fix**:
  1. Extract your running dev client signature:
     - For debug builds (local Expo dev client):
       ```bash
       keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android
       ```
       *(Default keystore password is `android`)*
     - For production / EAS builds:
       ```bash
       eas credentials
       ```
  2. Copy the `SHA-1` fingerprint from the terminal output.
  3. Go to the **Google Cloud Console** -> **API & Services** -> **Credentials** -> **OAuth 2.0 Client IDs**.
  4. Select your Android Client ID, ensure the Package Name is exactly `com.lattice.app`, and paste/update the **SHA-1 certificate fingerprint**.
  5. Save and rebuild the native app using `pnpm dev:android`.

### Issue: "Metro Bundler has stale environment cache / LAN IP connection issues"

- **Cause**: Metro aggressively caches the LAN IP or previous bundling files, leading to incorrect connection issues when switching physical networks or building production variants.
- **Fix**: Clear the Metro bundler cache by starting the dev client with the `--clear` flag:
  ```bash
  pnpm dev:mobile:lan:prod --clear
  ```

---

## Still stuck?

If your issue isn't listed here, please open a thread in the `#engineering-help` channel with:

1. A screenshot of the error.
2. What you were trying to do.
3. Your OS and Node version.
