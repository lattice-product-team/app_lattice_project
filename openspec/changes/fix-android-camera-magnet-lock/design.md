## Context

The map's "Follow User" and "FlyTo" features currently rely on a unidirectional flow: React sets a mode, and the native map follows. However, when the user physically touches the map to pan away, the native engine breaks its own tracking, but React doesn't always realize this. On Android, the flags meant to detect this interaction (`isUserInteraction`) are unreliable, leading to a state where React keeps forcing the camera back to its "locked" target, creating the magnet effect.

## Goals / Non-Goals

**Goals:**
- Implement a bi-directional state synchronization where the native engine can inform React that tracking has been broken.
- Ensure any physical touch on the map area immediately and irrevocably sets the camera mode to `FREE`.
- Remove manual "lockout" logic that causes race conditions on slow Android hardware.

**Non-Goals:**
- Modifying the underlying MapLibre native code.
- Removing the "Follow User" feature (it should still work, just break reliably).

## Decisions

- **Listen to `onUserTrackingModeChange`**: We will use this native MapLibre callback as the source of truth. If the native map stops following due to a gesture, we update our Zustand store immediately.
- **Force `FREE` on `onRegionWillChange`**: This event is the most reliable way to detect the *intent* to move on Android. If this fires and we aren't in a programmatic animation, we will force the camera state to `FREE` before the first frame of movement.
- **Atomic Store Updates**: Refactor `useMapUIStore` to remove the complex recursion guard (`isProcessingSetUIState`) and replace it with a simpler, direct state update pattern.
- **Constant Camera Props**: Ensure all `MapLibreGL.Camera` props (like `defaultSettings` and `padding`) are passed as stable constants to prevent the native engine from resetting the view on every React render.

## Risks / Trade-offs

- **[Risk]**: Accidental camera release during a slow automated flight. → **[Mitigation]**: Ensure the "isProgrammaticMove" flag is set *before* the camera command is sent and cleared *after* the animation duration.
- **[Risk]**: High frequency of state updates on Android. → **[Mitigation]**: Only trigger store updates if the `cameraMode` has actually changed (strict comparison).
