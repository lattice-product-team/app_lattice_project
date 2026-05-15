## 1. Camera Logic Refinement

- [x] 1.1 Update `MapCameraManager` to use a 45-degree pitch when entering `NAVIGATION` mode.
- [x] 1.2 Ensure `MapLibreGL.Camera` uses `followUserMode="compass"` during active navigation.
- [x] 1.3 Implement/Verify `isProgrammaticMoveRef` to mask `onUserTrackingModeChange` resets on Android.

## 2. Interaction & Gesture Fixes

- [x] 2.1 Refine `handleCameraChange` in `MapContent.tsx` to better distinguish between manual pans and programmatic navigation updates.
- [x] 2.2 Optimize zoom level throttling on Android to prevent UI re-renders during active tracking.

## 3. Verification & Platform Consistency

- [x] 3.1 Verify navigation camera transition and 3D pitch on Android.
- [x] 3.2 Verify manual "Centrar" (Recenter) button behavior and state transition.
- [x] 3.3 Regression test on iOS to ensure camera behavior remains stable.
