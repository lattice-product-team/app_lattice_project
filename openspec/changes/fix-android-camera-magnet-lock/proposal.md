## Why

Android devices suffer from a "camera magnet" effect where the map remains locked to the user's location or a selected POI, ignoring user drag gestures. This is caused by a reliable failure in the `isUserInteraction` flag on Android and a desynchronization between React state and the native MapLibre camera state. This fix moves from a "React-tells-Native" to a "Native-tells-React" architecture for camera state, ensuring the camera always releases when touched.

## What Changes

- **Native State Synchronization**: Implement `onUserTrackingModeChange` to synchronize the app's `cameraMode` with the native engine's internal state.
- **Aggressive Gesture Breaking**: Use `onRegionWillChange` to proactively set the camera to `FREE` mode whenever a non-programmatic movement is detected, bypassing unreliable native interaction flags.
- **Redundant Lock Removal**: Clean up `isProgrammaticMove` and other manual lockout logic that often fails to release on older Android hardware.
- **Atomic Mode Switching**: Refactor `useMapUIStore` to ensure camera mode transitions are atomic and not interrupted by race conditions.

## Capabilities

### New Capabilities
- `robust-camera-tracking`: A fail-safe camera tracking system that prioritizes user touch over programmatic locks on all platforms.

### Modified Capabilities
- `adaptive-map-controls`: Update requirements for camera mode transitions to ensure immediate responsiveness.

## Impact

- **Mobile App**: Massive improvement in map navigation on Android. Zero-latency breaking of camera locks.
- **Store Logic**: Simplification of `useMapUIStore` and `MapCameraManager`.
- **User Experience**: Consistent "feel" between iOS and Android versions of the map.
