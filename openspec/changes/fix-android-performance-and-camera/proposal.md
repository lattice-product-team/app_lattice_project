## Why

The Android version of the Lattice mobile application suffers from significant performance degradation (lag) and unresponsive map camera controls. As this is the first deployment to Android, these issues are likely due to unoptimized native view usage on the map and excessive React state updates during camera movement, which saturate the bridge and UI thread.

## What Changes

- **Map Rendering Optimization**: Replace expensive `PointAnnotation` native views with high-performance GL-based `SymbolLayer` or `CircleLayer` for event pins.
- **State Update Throttling**: Throttle or debounce React state updates triggered by `onRegionIsChanging` in the `MapContent` component to prevent re-render loops during map interactions.
- **Camera Logic Stabilization**: Refactor `MapCameraManager` to better coordinate between manual `setCamera` calls and native `followUserLocation` modes, specifically addressing Android-specific lifecycle issues.
- **Blur Performance Audit**: Optimize `SafeBlurView` for Android, potentially providing a simplified fallback if the native blur is too demanding on certain hardware.
- **Resource Management**: Ensure `AROverlay` and its Three.js `Canvas` do not consume resources when hidden, preventing background lag.

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `hybrid-map-rendering`: Optimize layer rendering for Android (transition from PointAnnotations to GL Layers).
- `adaptive-map-controls`: Fix camera responsiveness and interaction physics on Android.
- `pure-ui-animation-bridge`: Ensure smooth transitions between map and UI sheets without bridge saturation.

## Impact

- `apps/mobile/src/features/map/components/MapLayers.tsx`: Transition event markers to GL layers.
- `apps/mobile/src/features/map/components/MapContent.tsx`: Throttle camera change handlers.
- `apps/mobile/src/features/map/components/MapCameraManager.tsx`: Stabilize camera state and animations.
- `apps/mobile/src/components/ui/SafeBlurView.tsx`: Optimize or add fallbacks for Android blur.
- `apps/mobile/src/features/map/components/ar/AROverlay.tsx`: Verify resource disposal.
