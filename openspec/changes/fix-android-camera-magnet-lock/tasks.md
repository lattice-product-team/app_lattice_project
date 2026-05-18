## 1. Store Refactoring

- [x] 1.1 Refactor `useMapUIStore.ts` to simplify state updates and remove the problematic `isProcessingSetUIState` guard.
- [x] 1.2 Ensure the `cameraMode` is explicitly set to `FREE` in the store whenever the `uiState` returns to `EXPLORING`.

## 2. Native Integration & Synchronization

- [x] 2.1 Implement the `onUserTrackingModeChange` listener in `MapCameraManager.tsx` to sync native tracking breaks back to the Zustand store.
- [x] 2.2 Add `onRegionWillChange` to the `MapView` in `MapContent.tsx` to detect user gestures before movement begins and force the camera to `FREE` mode.

## 3. UI & Props Stability

- [x] 3.1 Extract all inline objects (like `defaultSettings` and `padding`) in `MapCameraManager.tsx` to stable constants to prevent the "render-loop-reset" bug on Android.
- [x] 3.2 Ensure `flyTo` durations are properly synchronized with the `isProgrammaticMove` flag to prevent premature lock releases.

## 4. Testing & Validation

- [x] 4.1 Verify that any manual pan gesture on Android immediately releases the camera from "Follow User" mode.
- [x] 4.2 Confirm that selecting an event or POI still triggers a smooth camera flyTo without getting permanently stuck.
