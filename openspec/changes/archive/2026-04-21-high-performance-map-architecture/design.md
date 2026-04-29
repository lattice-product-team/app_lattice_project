## Context

The current map implementation in `apps/mobile` is functional but consolidates too much logic in `MapIndex.tsx` and doesn't fully utilize the native performance capabilities of `MapLibreGL`. As the number of Points of Interest (POIs) increases, the lack of clustering and the tight coupling between the map and its HUD (Head-Up Display) overlays will degrade performance.

## Goals / Non-Goals

**Goals:**
- Implement **GPU-accelerated clustering** for markers.
- **Decouple HUD UI** from the Map render cycle to maintain 60fps.
- Refine **State Selection** to use atomic updates via Zustand.
- Standardize **Map Layer Styles** for better maintainability.

**Non-Goals:**
- Replacing MapLibre with another provider.
- Modifying the underlying GeoJSON schema from the backend.
- Overhauling the AR Overlay logic (keep as is, just integrate).

## Decisions

### 1. MapLibre Native Clustering
We will enable `cluster={true}` and `clusterRadius={50}` on the main `ShapeSource`. 
- **Rationale**: Native clustering is significantly faster than JS-based clustering. It allows the map engine to manage thousands of points in C++ rather than forcing React to render thousands of individual components.
- **Alternatives**: Custom JS clustering (too slow), Backend-side clustering (adds latency and complexity).

### 2. HUD Separation Pattern
`MapIndex.tsx` will be refactored into a "Controller" that manages the visibility and data of overlays (Sheets, Search, Carousels) while `MapContent.tsx` remains a pure, memoized map renderer.
- **Rationale**: Prevents the expensive Map component from re-rendering when minor UI elements (like a search bar focus) change.

### 3. Selection Highlighting via Filter
Instead of a separate `selectionSource`, we will use a **Filter** on the existing POI layers to highlight the selected point.
- **Rationale**: Minimizes the number of sources and layers the GPU needs to manage.
- **Implementation**: Use MapLibre expressions like `['==', ['get', 'id'], selectedPoiId]`.

## Risks / Trade-offs

- **[Risk]** Clustering might obscure high-priority POIs (e.g., "Main Stage").
  - **Mitigation**: Implement a "Priority" property in GeoJSON to exempt certain POIs from clustering or give them larger icons.
- **[Risk]** Bottom Sheet gestures might conflict with Map pan gestures.
  - **Mitigation**: Use `react-native-gesture-handler`'s `simultaneousHandlers` and properly manage `PointerEvents`.
