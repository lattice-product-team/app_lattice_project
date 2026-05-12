# Design: Map Camera Lifecycle & Stability

## Architecture Overview

The map camera logic will be transitioned from a boolean-based tracking system to a state-driven lifecycle manager. This ensures that camera movements are predictable, user interventions are respected, and map layers remain stable during transitions.

## Technical Decisions

### 1. Camera Mode State Machine
We will introduce a `MapCameraMode` enum in `useMapUIStore.ts`:
- `FREE`: Default mode. User has full control. Recenter button performs a one-shot move.
- `FOLLOW`: Automatic tracking of user location without rotation (2D view).
- `NAVIGATION`: High-priority tracking with course-rotation and 3D pitch (Active Navigation).

### 2. MapCameraManager Refactor
The `MapCameraManager` component will be updated to orchestrate movements based on the active mode:
- **Recenter Logic**: Will call `cameraRef.current.setCamera()` with a smooth `flyTo` animation but will NOT enable `followUserLocation`.
- **Gesture Detection**: Implement `onMoveStart` and `onUserLocationUpdate` listeners to detect when the user manually interrupts a following state.
- **Layer Stability**: Use a persistent `ShapeSource` and `SymbolLayer` configuration that decouples data visibility from camera animation states.

### 3. Animation & Performance
- Use `flyTo` for long-distance jumps (Recenter, selecting POIs).
- Use `easeTo` for subtle adjustments.
- Implement a 500ms debounce for camera updates triggered by store changes to prevent "jitter".

## User Interface Changes

- **Recenter Button**: Visual feedback will show it's a one-time action. If the user double-taps, it may transition to `FOLLOW` mode (optional future enhancement).
- **HUD Integration**: The `AdaptiveControlOverlay` will reflect the current camera mode through subtle icon state changes (e.g., active color for tracking).

## Detailed Component Plan

### `useMapUIStore.ts`
- Add `cameraMode: MapCameraMode`.
- Add `setCameraMode(mode: MapCameraMode)`.

### `MapCameraManager.tsx`
- Replace `followUserLocation={isFollowingUser}` with logic derived from `cameraMode`.
- Ensure `recenterCount` only triggers a one-shot animation.

### `MapContent.tsx`
- Refactor layer definitions to use `memo` and stable IDs to prevent "disappearing" elements during camera re-renders.
