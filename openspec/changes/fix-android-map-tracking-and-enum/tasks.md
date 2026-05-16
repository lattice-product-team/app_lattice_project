## 1. State Management Refactor

- [x] 1.1 Import `UserTrackingMode` from `@maplibre/maplibre-react-native` in `useMapUIStore.ts`.
- [x] 1.2 Update `MapCameraMode` enum or replace it with `UserTrackingMode` in the store definition.
- [x] 1.3 Refactor `triggerRecenter` to cycle through the 4 integer states (0, 1, 2, 3).
- [x] 1.4 Update `setUIState` to use the new integer values when forcing camera states.

## 2. Camera Manager Stabilization

- [x] 2.1 Update `MapCameraManager.tsx` to accept the integer `cameraMode`.
- [x] 2.2 Refactor `safetyReset` to include `centerCoordinate` on Android using `lastCameraPosition`.
- [x] 2.3 Replace `followUserLocation` and `followUserMode` props in `<MapLibreGL.Camera />` with a single `userTrackingMode` prop.
- [x] 2.4 Verify `onUserTrackingModeChange` logic still correctly breaks the lock on manual interaction.

## 3. UI Component Alignment

- [x] 3.1 Update `CenteringButton.tsx` to check for `UserTrackingMode.None` instead of `MapCameraMode.FREE`.
- [x] 3.2 Update `AdaptiveControlOverlay.tsx` to correctly render icons based on the new integer tracking states.
- [x] 3.3 Ensure haptic feedback is preserved in all updated interaction points.

## 4. Verification & Testing

- [x] 4.1 Verify that deselecting a POI on Android no longer causes a camera "bounce".
- [x] 4.2 Verify the 4-state cycle (None -> Follow -> Compass -> Course) works correctly on both platforms.
- [x] 4.3 Regression test iOS to ensure no behavior changes in navigation or exploration.
