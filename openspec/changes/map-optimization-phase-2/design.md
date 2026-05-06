## Context

The current map implementation relies exclusively on `MapLibreGL.MarkerView` for all points of interest (POIs) and events. In React Native MapLibre, `MarkerView`s are native views positioned over the map. This approach suffers from two main issues:
1. **Performance**: Handling 100+ native views synchronized with map movement is expensive for the main thread.
2. **Synchronization Lag**: A "flash" at (0,0) coordinates occurs when a marker is mounted before its screen-space projection is calculated by the native engine.

## Goals / Non-Goals

**Goals:**
- Eliminate the (0,0) coordinate flash for all map icons.
- Maintain 60fps performance during complex map gestures (pan/zoom).
- Modularize the map architecture for easier feature additions.
- Ensure strict coordinate validation before data reaches the map engine.

**Non-Goals:**
- Changing the visual style or assets of the icons.
- Implementing server-side clustering.
- Adding new map features outside of rendering and performance.

## Decisions

### 1. Hybrid Rendering Strategy (GL + React)
- **Decision**: Background and non-interactive POIs will be rendered using a `MapLibreGL.SymbolLayer` within a `ShapeSource`. Only "active" elements (the currently selected POI and primary events) will be rendered as `MarkerView`.
- **Rationale**: `SymbolLayer` is part of the GL engine's render loop, making it immune to the (0,0) projection lag and significantly more performant for large datasets. `MarkerView` is reserved for items needing React-driven animations.
- **Alternatives**: Using `PointAnnotation` (still has positioning issues) or `CircleLayer` (not enough visual detail).

### 2. Map Component Decomposition
- **Decision**: Split `MapContent.tsx` into:
    - `MapCameraManager`: Logic for flyTo, fitBounds, and zoom tracking.
    - `MapLayers`: Declarative definition of sources and GL layers (Symbol, Fill, Line).
    - `MapInteractionLayer`: Container for `MarkerView` components.
- **Rationale**: Separation of concerns makes the code more maintainable and reduces the surface area for unnecessary re-renders.

### 3. Decoupled Data Adapter Layer
- **Decision**: Implement a `poiAdapter.ts` that transforms raw API/GeoJSON data into the `StandardUIPOI` format used by the UI.
- **Rationale**: Moving normalization out of the component prevents expensive recalculations on every render frame. This layer will also perform strict coordinate validation.

### 4. Robust Opacity-Based Reveal for MarkerViews
- **Decision**: Keep the `opacity: 0` initial state and withTiming(1) reveal for the few remaining `MarkerView`s.
- **Rationale**: Provides a 150ms buffer for the native bridge to synchronize coordinates for complex animated markers.

## Risks / Trade-offs

- **[Risk] SymbolLayer Interaction Complexity** → Mitigation: Use the `onPress` prop on `ShapeSource` to handle clicks on GL-rendered icons, mapping the returned feature ID back to the store state.
- **[Risk] Data Synchronization** → Mitigation: Ensure the adapter is memoized and only re-runs when source data changes.
- **[Risk] Layer Ordering** → Mitigation: Use explicit layer IDs and `aboveLayerID` props to ensure `MarkerView`s and GL layers stack correctly (Labels above fills, interaction layers on top).
