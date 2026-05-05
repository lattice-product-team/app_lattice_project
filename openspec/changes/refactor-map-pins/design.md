## Context

The current map implementation relies heavily on `MarkerView` for all pin types (Events and POIs). This causes two major issues:
1. **Positional Instability**: Pins flash at (0,0) coordinates during mounting or camera resets.
2. **Performance Bottlenecks**: Rendering numerous native views on top of the map engine limits scalability and creates stutter during zoom/pan.
3. **Stale Logic**: Sub-POIs are only visible via manual selection or geofencing, missing a natural "approaching" discovery flow.

## Goals / Non-Goals

**Goals:**
- Eliminate the "top-left jump" bug in map pins.
- Achieve 60FPS fluid interactions during zoom and pan with hundreds of POIs.
- Implement a hierarchical zoom-based visibility system (Events at low zoom, POIs emerging at high zoom).
- Ensure visual parity and stability across iOS and Android.

**Non-Goals:**
- Implementing clustering (will be addressed in a future change if needed).
- Changing the underlying MapLibre library.
- Modifying the map's base style or tile source.

## Decisions

### 1. Virtual Marker Overlay Architecture (Events)
- **Decision**: Render Event pins as absolute-positioned React components in an overlay layer *on top* of the map, instead of using internal `MarkerView` or `SymbolLayer`.
- **Rationale**: internal MapLibre markers (`MarkerView`, `PointAnnotation`) are prone to flickering during re-renders and (0,0) coordinate jumps. By moving them to a dedicated React Native layer, we gain full CSS-like styling control (perfect circles, shadows, animations) and eliminate native rendering glitches.
- **Sync Mechanism**: Use a high-frequency projection hook that calculates screen `(x, y)` coordinates from geographic `(lat, lng)` using the map's current camera state (center, zoom, pitch, bearing).

### 2. GPU-Based SymbolLayer (POIs)
- **Decision**: Maintain `SymbolLayer` for "Simple" POI pins.
- **Rationale**: For hundreds of secondary points, GPU rendering is the only way to maintain performance. These points are simpler and don't require the same high-fidelity styling as Hero Events.

### 3. Screen-Space Projection Sync
- **Decision**: Use `react-native-reanimated` to update pin positions on the UI thread.
- **Rationale**: Ensures that pins follow the map movement with minimal "float" or lag, achieving a high-fidelity feel.

## Risks / Trade-offs

- **[Risk] Sync Lag** → **Mitigation**: Using `onRegionIsChanging` to feed camera updates into a Reanimated shared value for sub-pixel precision movement.
- **[Risk] Interaction Parity** → **Mitigation**: Using standard React Native `TouchableOpacity` or `Pressable` on the overlay pins, which is more reliable than map-based press events for complex UI.
- **[Risk] Z-Index Management** → **Mitigation**: The overlay layer will always be above map layers but below global UI elements (like the discovery sheet).
