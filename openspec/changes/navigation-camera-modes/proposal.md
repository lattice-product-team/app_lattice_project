## Why

The mobile map currently lacks active tracking and smart camera transitions during navigation. The user experiences a "static" map that doesn't follow their movement or align with their orientation, and the camera doesn't provide a smooth focus when planning a route. This change introduces a professional, "Apple-style" navigation experience where the camera intelligently toggles between active tracking and free exploration.

## What Changes

- **Active Tracking Mode**: Implementation of location and orientation-based tracking during navigation, ensuring the map aligns with the user's direction of travel and heading.
- **Gesture-Based Interruption**: Automated decoupling of camera tracking when the user manually interacts (pans, zooms, rotates) with the map surface.
- **Smart Planning Transition**: High-fidelity `flyTo` transitions to the user's location when entering the route planning phase.
- **Recenter Interaction**: A dedicated floating "Recenter" button that appears during navigation to allow the user to easily re-engage the active tracking mode after free exploration.

## Capabilities

### New Capabilities

- `map-navigation-camera`: Orchestration of specialized camera modes (active tracking, free, planning focus) to ensure a seamless navigation experience.

### Modified Capabilities

- `navigation-system`: Extending and refining the active navigation camera tracking, gesture interruptions, recentering, and planning transitions.

## Impact

- **Affected Components**: `MapCameraManager.tsx`, `MapContent.tsx`, `CenteringButton.tsx`.
- **State Management**: `useMapUIStore.ts`, `useNavigationStore.ts`.
- **User Experience**: Drastic improvement in navigation readability and responsiveness.
