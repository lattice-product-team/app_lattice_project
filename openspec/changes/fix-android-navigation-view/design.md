## Context

The current navigation implementation works reliably on iOS but fails to provide a "driving-like" experience on Android. Issues include the camera staying in 2D (0 pitch), the map not following the user's heading, and programmatic movements being misinterpreted as manual gestures, causing the camera to revert to `FREE` mode prematurely.

## Goals / Non-Goals

**Goals:**

- Enable 3D perspective (pitch) by default in navigation mode.
- Fix heading tracking (compass) on Android.
- Prevent programmatic camera movements from triggering "FREE" mode on Android.
- Ensure manual gestures still correctly trigger "FREE" mode.

**Non-Goals:**

- Implement real-time route recalculation.
- Redesign the navigation UI banners/sheets.
- Change map tile styles or layers.

## Decisions

### 1. Refine `isUserInteraction` Detection in `MapContent.tsx`

On Android, `onRegionIsChanging` can be triggered by programmatic `setCamera` calls.

- **Decision**: Use a shared `isProgrammaticMoveRef` in `MapCameraManager` (passed via context or store if needed, but currently accessible via internal component logic) to mask interaction detection during transitions.
- **Rationale**: Android's native MapLibre bridge is noisier with events than iOS.

### 2. Default Pitch in Navigation

- **Decision**: Update `MapCameraManager` to explicitly set `pitch: 45` when `cameraMode` transitions to `NAVIGATION`.
- **Rationale**: Align with `navigation-system` spec and user expectations for a "driving view".

### 3. Use `followUserMode="compass"` on Android

- **Decision**: Ensure `MapLibreGL.Camera` uses `followUserMode="compass"` when in navigation.
- **Rationale**: This enables automatic rotation of the map based on device heading, which is currently inconsistent on Android.

## Risks / Trade-offs

- **[Risk] Performance Jitter** → Mitigation: Throttling discrete zoom updates in `MapContent` (already partially implemented, will be verified).
- **[Risk] Camera Fighting** → Mitigation: Use clear `useEffect` dependencies and `isProgrammaticMoveRef` to ensure only one "goal" is active at a time.
- **[Risk] Platform Divergence** → Mitigation: Test extensively on both platforms to ensure iOS remains stable.
