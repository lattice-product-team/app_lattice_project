## Why

The current map camera behavior in the Lattice mobile app is unpredictable and lacks professional refinement. Specifically, the "recenter" action incorrectly triggers a persistent "follow" mode, and camera transitions often lead to map layers (Events/POIs) disappearing due to unoptimized state synchronization and re-renders.

## What Changes

- **Single-shot Recenter**: The center button will perform a one-time camera move to the user's location instead of activating continuous tracking (unless explicitly in navigation mode).
- **Camera State Management**: Introduce a clear distinction between `FREE`, `FOLLOW`, and `NAVIGATION` camera modes to prevent logic conflicts.
- **Layer Persistence**: Optimize the MapLibre layer lifecycle to ensure that Events and POIs remain visible during camera transitions and UI state changes.
- **Smooth Animation Curves**: Refine camera ease-in/out curves for a more premium, fluid feel when jumping between locations.

## Capabilities

### New Capabilities
- `camera-lifecycle-manager`: A specialized manager to coordinate camera modes and prevent conflicting state updates.

### Modified Capabilities
- `navigation-system`: Refine camera behavior during active navigation to distinguish it from the standard "follow" mode.
- `adaptive-map-controls`: Update the "Recenter" button behavior to match the new one-time centering logic.

## Impact

- `apps/mobile/app/(main)/index.tsx`: Main map page camera logic and state orchestration.
- `apps/mobile/src/features/map/components/MapContent.tsx`: Layer rendering logic and camera component configuration.
- `apps/mobile/src/features/map/store/useMapUIStore.ts`: UI state definitions for camera modes.
