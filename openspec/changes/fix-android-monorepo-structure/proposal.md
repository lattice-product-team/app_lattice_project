## Why

The current monorepo structure causes EAS Build failures due to a conflicting `app.json` at the root and an unoptimized `eas.json` location. This change standardizes the Expo configuration for a pnpm monorepo to ensure reliable cloud builds.

## What Changes

- **REMOVAL**: Delete the conflicting/redundant `app.json` at the project root.
- **MODIFICATION**: Move `eas.json` from `apps/mobile/` to the project root.
- **MODIFICATION**: Update root `package.json` scripts to trigger EAS builds using the root configuration.
- **MODIFICATION**: Ensure `app.config.ts` in `apps/mobile` remains the single source of truth for app metadata.

## Capabilities

### New Capabilities
- `monorepo-build-standardization`: Establishing a single, reliable way to build mobile apps within the monorepo using EAS.

### Modified Capabilities
- `android-cloud-build`: Updating the implementation path for Android cloud builds to support the new structure.

## Impact

- Root project structure (removal of `app.json`, addition of `eas.json`).
- Root `package.json` scripts.
- EAS Build workflow (now triggered from root context).
