import { Callout } from 'nextra/components'

# Troubleshooting Guide

This guide compiles common issues, error codes, and operational resolutions encountered during local development, container orchestration, and mobile testing in the Lattice ecosystem.

---

## 1. Database & Geospatial Failures

### Error: "Failed to connect to PostgreSQL / Connection Refused"

*   **Underlying Cause**: The Docker container service is inactive, or a host PostgreSQL service is already occupying the target port.
*   **Resolution Strategy**:
    1.  Execute `docker ps` to verify container operations.
    2.  If port `5433` is occupied, stop any native PostgreSQL instances running on your workstation.
    3.  Alternatively, adjust the host port binding configuration within `docker-compose.yml` to map to an open port, and update `DATABASE_URL` inside `.env`.

### Error: "Relation 'events' does not exist / Query Failed"

*   **Underlying Cause**: Database table migrations have not been applied.
*   **Resolution Strategy**:
    1.  Ensure your PostGIS database is active.
    2.  Run `pnpm db:migrate` followed by `pnpm db:seed` from the root workspace directory.

---

## 2. Monorepo & Package Resolutions

### Error: "Cannot find module '@app/core' or '@app/db'"

*   **Underlying Cause**: Shared packages have not been compiled, preventing the TypeScript compiler from resolving type definitions in client applications.
*   **Resolution Strategy**:
    *   Execute `pnpm build` from the workspace root to compile all internal dependencies in the correct order.

### Performance: "pnpm install takes an excessive amount of time"

*   **Resolution Strategy**:
    *   Prune the local pnpm store to clear stale metadata and corrupted package packages:
        ```bash
        pnpm store prune
        ```

---

## 3. Mobile App & Simulator Troubleshooting

### Issue: "White screen on emulator / Connection Refused"

*   **Underlying Cause**: The Metro bundler is active, but the client application is unable to establish an initial handshake with the Express API server.
*   **Resolution Strategy**:
    1.  Ensure your API server is running (`pnpm dev:api`).
    2.  Confirm that `LAN_IP` inside `.env` matches your workstation's current IP address on the local Wi-Fi network.
    3.  Verify that both your workstation and physical testing device are connected to the exact same Wi-Fi SSID network.

### Issue: "Map vector graphics are failing to render"

*   **Underlying Cause**: Missing or invalid MapTiler/Mapbox API key parameters.
*   **Resolution Strategy**:
    *   Confirm that your `.env` contains a valid `MAPTILER_KEY`. Restart the Metro bundler using `pnpm dev:mobile:lan --clear` to invalidate the cache.

---

## 4. Web Admin Hydration Errors

### Error: "Hydration failed because the initial UI does not match..."

*   **Underlying Cause**: A React hydration mismatch in Next.js, typically caused by accessing client-side browser globals (such as `window` or `document`) during the server-rendering phase.
*   **Resolution Strategy**:
    1.  Wrap browser-only initializations within a `useEffect` hook to defer execution until mounting is complete:
        ```typescript
        useEffect(() => {
          if (typeof window !== 'undefined') {
            // Perform client-safe operations
          }
        }, []);
        ```
    2.  Alternatively, disable server-side rendering for the affected component using Next.js dynamic imports:
        ```typescript
        const DynamicMap = dynamic(() => import('./MapComponent'), { ssr: false });
        ```

---

## 5. Google OAuth & Deep Linking (Android)

### Error: "The provided Linking scheme does not appear in the list of possible URI schemes..."

*   **Underlying Cause**: Expo's `makeRedirectUri` generates a callback URL containing your reverse Client ID scheme. If this scheme is not declared in your `app.json` config under `expo.scheme`, the Metro bundler will throw a warning, and Google will block the redirect back to the app.
*   **Resolution Strategy**:
    1.  Add the reverse Google Client ID as a scheme in your local `app.json` under `expo.scheme`:
        ```json
        "scheme": [
          "lattice",
          "com.lattice.app",
          "com.googleusercontent.apps.560870004174-9hphgg5sqq69nc5hp9mn1lbsnb8ulda3"
        ]
        ```
    2.  Any changes to `app.json` scheme or linking intents require a native prebuild regeneration. Run `pnpm dev:android` or `npx expo prebuild --clean` to recompile the native Android manifest.

### Error: "access_blocked: Lattice request is invalid (Error 400: invalid_request)"

*   **Underlying Cause**: The SHA-1 certificate fingerprint of your running mobile client does not match the fingerprint registered in the Google Cloud Console credentials under the target package name (`com.lattice.app`).
*   **Resolution Strategy**:
    1.  Extract your running dev client signature:
        *   For local debug builds:
            ```bash
            keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android
            ```
        *   For production EAS builds:
            ```bash
            eas credentials
            ```
    2.  Copy the SHA-1 fingerprint output.
    3.  Navigate to your Google Cloud Console -> **APIs & Services** -> **Credentials**.
    4.  Select your active Android Client ID, ensure the Package Name is exactly `com.lattice.app`, and paste/update the **SHA-1 certificate fingerprint**.
    5.  Save the settings and rebuild the client application.

<Callout type="warning">
  **Stale Environment Cache**: The Metro bundler aggressively caches environment parameters. When changing `.env` variables or switching networks, always restart the mobile bundler clearing its cache: `pnpm dev:mobile:lan --clear`.
</Callout>
