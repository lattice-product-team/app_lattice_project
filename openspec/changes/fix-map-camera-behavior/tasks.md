## 1. State Management (Zustand)

- [x] 1.1 Add `MapCameraMode` enum (`FREE`, `FOLLOW`, `NAVIGATION`) to `useMapUIStore.ts`
- [x] 1.2 Implement `cameraMode` state and `setCameraMode` action in `useMapUIStore.ts`
- [x] 1.3 Update `triggerRecenter` to ensure it doesn't force a permanent follow state

## 2. Refactor MapCameraManager

- [x] 2.1 Update `MapCameraManager` to use the new `cameraMode` state instead of simple booleans
- [x] 2.2 Refactor the Recenter logic to use a one-shot `flyTo` animation and disable persistent tracking
- [x] 2.3 Implement a user interaction listener to transition camera to `FREE` mode when the user pans manually
- [x] 2.4 Synchronize `followUserLocation` and `followUserMode` props with the active `cameraMode`

## 3. Layer Stability & UI

- [x] 3.1 Review `MapContent.tsx` layers to ensure they use stable IDs and don't flicker during camera moves
- [x] 3.2 Update `AdaptiveControlOverlay` buttons to reflect the active camera mode visually
- [x] 3.3 Test the transition from active navigation back to free exploration mode

## 4. Polish & Verification

- [x] 4.1 Fine-tune camera animation easing and durations for a "premium" feel
- [x] 4.2 Verify that events no longer "disappear" during fast camera transitions
- [x] 4.3 Final validation of the recenter behavior on physical device
