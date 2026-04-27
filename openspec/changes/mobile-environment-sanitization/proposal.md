## Why

The current monorepo structure has duplicated and hoisted dependencies (`expo`, `react`, `react-native`) at the root level, causing Metro to use an incorrect entry point (`AppEntry.js` at the root) instead of the local mobile app configuration. This results in resolution errors and runtime crashes (NitroModules errors) when attempting to open the app in Expo Go instead of a proper Development Build.

## What Changes

- **Dependency Cleanup**: Remove `expo`, `react`, and `react-native` from the monorepo root `package.json` to prevent hoisting-related entry point resolution issues.
- **Environment Stabilization**: Clean and reinstall dependencies using `pnpm` to ensure correct symbolic links.
- **Entry Point Consolidation**: Ensure `apps/mobile/app/(main)/index.tsx` and other routes have clean default exports for reliable routing.
- **Native Build Alignment**: Enforce the use of the `mobile` URL scheme to match the current native iOS/Android builds.

## Capabilities

### New Capabilities
- `environment-health-check`: Implementation of basic scripts to verify dependency hoisting status and entry point resolution.

### Modified Capabilities
- `mobile-navigation`: Updated to ensure strict file-based routing without fallback resolution to root `App.js`.

## Impact

- **Monorepo Structure**: Root `package.json` and `node_modules` will be significantly cleaner.
- **Developer Workflow**: Developers must now use the development build exclusively; Expo Go will no longer be supported due to native module requirements (`MMKV`, `MapLibre`).
- **Build System**: Native build schemes are now strictly aligned with `app.json`.
