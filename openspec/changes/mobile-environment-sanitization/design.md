## Context

The monorepo uses `pnpm` with hoisting. Currently, core mobile dependencies (`expo`, `react`, `react-native`) are present in both the root `package.json` and `apps/mobile/package.json`. This causes Metro to resolve the entry point from the root's `node_modules/expo/AppEntry.js`, which then fails to find an `App.js` at the root. Furthermore, attempting to use Expo Go with native modules like `react-native-mmkv` and `MapLibre` results in runtime crashes.

## Goals / Non-Goals

**Goals:**
- Eliminate entry point resolution ambiguity by removing mobile dependencies from the root.
- Force all mobile development to use the Development Client build.
- Standardize the `mobile` URL scheme across all configurations.

**Non-Goals:**
- Upgrading Expo or React Native versions.
- Modifying backend services or other monorepo apps.

## Decisions

### 1. Remove mobile dependencies from root `package.json`
- **Decision**: Delete `expo`, `react`, and `react-native` from the root dependencies.
- **Rationale**: These are app-specific dependencies. Having them at the root triggers default Expo behavior that is incompatible with a monorepo sub-app structure.
- **Alternative**: Configuring Metro to ignore root `node_modules`. (Rejected: Too complex to maintain and brittle across different developer environments).

### 2. Strictly enforce Development Client
- **Decision**: Disable "Expo Go" support by removing any fallback logic for it in `SafeBlurView` or other components.
- **Rationale**: The app requires native modules that will never be in Expo Go. Providing fallbacks creates a degraded experience and maintenance burden.

### 3. URL Scheme Standardization
- **Decision**: Use `mobile` as the primary scheme in `app.json` and `npx expo` commands.
- **Rationale**: Matches the current iOS/Android native build configuration, avoiding "Unknown scheme" errors during app launch.

## Risks / Trade-offs

- **[Risk]** Root tools (like `turbo` or `eslint`) might fail if they expect these dependencies. → **Mitigation**: Keep `eslint-config-expo` in root `devDependencies` and ensure `pnpm` can still resolve them through workspace links.
- **[Risk]** Developers might be confused by the loss of Expo Go. → **Mitigation**: Update `README.md` and documentation to explicitly state the requirement for a development build.
