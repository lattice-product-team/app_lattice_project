## Why

Users on Android experience inconsistent navigation behavior compared to iOS. Specifically, the map fails to enter a 3D "driving view" (pitch), does not reliably follow the user's location and heading, and can become "stuck" or non-responsive to manual interaction when navigation mode is active. This creates a frustrating and potentially unsafe user experience for Android users.

## What Changes

- **Navigation View Perspective**: Automatically enable a 3D perspective (pitch) when entering active navigation mode.
- **Platform-Specific Interaction Logic**: Refine the camera mode detection on Android to distinguish between programmatic movements (navigation) and manual user gestures, preventing accidental "free mode" transitions.
- **Heading Synchronization**: Ensure the map reliably rotates to match the user's direction of travel (compass/heading) when in navigation mode.
- **Gesture Reliability**: Fix the "locked" map feel on Android by improving the hand-off between native tracking and manual panning.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `navigation-system`: Update the requirement for platform-specific camera handling and perspective defaults during active navigation.

## Impact

- **Affected Components**: `MapContent.tsx`, `MapCameraManager.tsx`, `useMapUIStore.ts`.
- **Platforms**: Primary impact on Android; requires verification on iOS to ensure no regressions.
- **User Experience**: Drastically improved navigation feel on Android, aligning it with industry standards (Google Maps/Apple Maps).
