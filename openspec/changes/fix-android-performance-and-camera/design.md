## Context

The Lattice mobile application, while performant on iOS, suffers from significant frame drops and unresponsive camera controls on Android. This is primarily due to:

- **Native View Overhead**: The use of `PointAnnotation` for all event markers creates a high volume of native Android views that must be synchronized with the map engine, saturating the UI thread.
- **State Update Flooding**: The `onRegionIsChanging` event in `MapContent.tsx` triggers React state updates at 60fps, causing constant re-renders of the component tree during map gestures.
- **Bridge Saturation**: High-frequency communication between the JavaScript and Native layers (bridge) during animations causes commands like `setCamera` to be delayed or dropped.

## Goals / Non-Goals

**Goals:**

- **Fluid Interaction**: Achieve 60fps performance during map panning and zooming on Android.
- **Responsive Camera**: Ensure the map camera responds immediately to selection events without "sticking".
- **Bridge Optimization**: Minimize the number of React state updates triggered during continuous gestures.
- **Visual Stability**: Maintain the premium "glass" aesthetic while providing performance fallbacks where necessary.

**Non-Goals:**

- **Feature Redesign**: This change does not aim to change the visual design of the pins or the map, only their implementation.
- **Total AR Overhaul**: While AR performance is a concern, a full optimization of the Three.js scene is out of scope for this performance pass.

## Decisions

### 1. GL-Based Event Layer

- **Decision**: Replace `PointAnnotation` in `MapLayers.tsx` with a combination of `MapLibreGL.CircleLayer` and `MapLibreGL.SymbolLayer`.
- **Rationale**: GL layers are rendered directly by the map's internal engine on the GPU, bypassing the React Native shadow tree and native Android view hierarchy.
- **Implementation**: Use `MapLibreGL.Images` to register event thumbnails into the texture atlas and display them using a `SymbolLayer`.

### 2. Viewport State Throttling

- **Decision**: Implement a custom throttling mechanism for zoom and center updates in `MapContent.tsx`.
- **Rationale**: Reducing the frequency of `setState` calls from ~60 per second to ~10 per second drastically reduces the workload on the JS thread and prevents unnecessary re-renders of the discovery sheet and overlays.
- **Threshold**: Only update state if zoom changes by > 0.15 or center changes significantly, with a minimum interval of 100ms.

### 3. Camera Command Guarding

- **Decision**: Refactor `MapCameraManager` to use a "busy" flag or a debounce for rapid camera transitions.
- **Rationale**: Prevents multiple overlapping `flyTo` or `fitBounds` commands from being sent to the native side, which is a known cause of camera "stuck" states on Android.

### 4. Adaptive Blur for Android

- **Decision**: Modify `SafeBlurView` to detect Android and apply a reduced `intensity` or a high-performance translucent fallback if the device performance is detected as low (or simply as a default for Android to ensure stability).
- **Rationale**: `expo-blur` on Android can be erratic and heavy depending on the device's hardware acceleration capabilities.

## Risks / Trade-offs

- **[Risk] Interaction Accuracy** → Using GL layers for interaction (onPress) can sometimes be less precise than native view tapping.
  - **Mitigation**: Increase the `hitbox` or `circleRadius` of the underlying interaction layer.
- **[Risk] Asset Loading** → Registering many remote images into the GL texture atlas can consume memory.
  - **Mitigation**: Only register images for events currently in or near the viewport.
- **[Risk] State Lag** → Throttling state updates might make the UI (like zoom indicators) feel slightly "behind" the map.
  - **Mitigation**: Keep the throttle low (100ms) and use Reanimated shared values for anything that needs perfect sync.
