## Context

The current project uses Expo (SDK 54) but lacks a formalized Android build configuration. We need to bridge the gap between local development and cloud production builds using EAS.

## Goals / Non-Goals

**Goals:**
- Define a scalable `eas.json` configuration for Android.
- Automate Android metadata setup in `app.json`.
- Ensure environment variables (MapTiler keys, API endpoints) are correctly injected during cloud builds.

**Non-Goals:**
- Setting up local Android SDKs or Android Studio.
- Automating Google Play Store submissions (manual upload for now).

## Decisions

### 1. EAS Profile Strategy
**Decision**: Implement three primary profiles in `eas.json`:
- `development`: Used for creating the internal "Development Build" APK.
- `preview`: Used for generating release-ready APKs for internal testing.
- `production`: Used for generating the final AAB (Android App Bundle) for the store.
**Rationale**: This follows Expo best practices and provides a clear path from development to release.

### 2. Environment Variable Management
**Decision**: Use `eas secret` to store sensitive keys (like MAPTILER_KEY) and reference them in `eas.json` under `env` keys.
**Rationale**: Keeps secrets out of version control while making them available to the cloud build worker.

### 3. Android Package Naming
**Decision**: Standardize on `com.lattice.app` as the unique identifier.
**Rationale**: Follows standard reverse-domain naming conventions.

## Risks / Trade-offs

- **[Risk]** Cloud builds can be slow during peak hours on the free tier.
  - → **Mitigation**: Advise the user to plan builds ahead or use the local build method if they have the hardware in the future.
- **[Risk]** Map rendering issues due to missing API keys in the build.
  - → **Mitigation**: Include a pre-build check task to verify environment variables are set in the EAS cloud.
