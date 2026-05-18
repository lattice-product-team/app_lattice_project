## Why

Android users experience a frustrating "bounce" effect when deselecting POIs/Events, where the camera snaps back to the previously selected location instead of remaining stationary. Additionally, the current camera tracking system uses a non-standard, string-based enum that complicates cross-platform reliability and relies on obsolete library props.

## What Changes

- **Android Camera Stability**: Fix the race condition in `MapCameraManager` that causes re-centering during deselection by ensuring the current center is preserved when resetting padding.
- **Unified Tracking System**: Replace the custom string-based `MapCameraMode` with the native `UserTrackingMode` enum from `@maplibre/maplibre-react-native`.
- **Logic Cleanup**: Remove obsolete `followUserMode` and `followUserLocation` prop mappings in favor of a direct, integer-based tracking state.
- **Platform Consistency**: Align Android's camera behavior with iOS, specifically regarding how padding and tracking states are handled during UI transitions.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `navigation-system`: Update tracking mode requirements to use native integer enums for improved Android stability.
- `adaptive-map-controls`: Refine the 4-state recenter cycle to align with the new native tracking modes.

## Impact

- **Affected Components**: `MapCameraManager.tsx`, `useMapUIStore.ts`, `CenteringButton.tsx`, `AdaptiveControlOverlay.tsx`.
- **State Management**: Update `useMapUIStore` state schema to store `UserTrackingMode`.
- **Platforms**: Primary fix for Android stability; requires verification on iOS to ensure consistent behavior.
