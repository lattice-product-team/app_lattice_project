## Why

The current map implementation exhibits visual glitches (markers flashing at top-left 0,0 coordinates) and performance bottlenecks when handling a large number of POIs. This update introduces a more scalable, professional architecture to achieve a "premium" interaction feel and stable rendering.

## What Changes

- **Hybrid Rendering Architecture**: Transition from rendering all POIs as React Native `MarkerView`s to a hybrid approach using MapLibre's GL-based `SymbolLayer` for background POIs and `MarkerView` only for active/selected items.
- **Map Component Decomposition**: Refactor the monolithic `MapContent.tsx` into specialized sub-components (`MapCamera`, `MapLayers`, `MapInteractionLayer`) for better maintainability and performance.
- **Centralized Data Adapter**: Implement a dedicated normalization layer to handle coordinate validation and data transformation outside the main render loop.
- **Enhanced Coordinate Validation**: Strict filtering of invalid or missing coordinates to prevent any native-layer positioning errors.

## Capabilities

### New Capabilities
- `hybrid-map-rendering`: Requirements for high-performance map rendering using GL layers and selective React marker injection.

### Modified Capabilities
- `map-aesthetic-control`: Update requirements to include guidelines for marker stability and coordinate validation standards.

## Impact

- **apps/mobile/src/features/map/components/MapContent.tsx**: Major refactor and decomposition.
- **apps/mobile/src/features/poi/adapters/**: New directory for data transformation logic.
- **apps/mobile/src/features/map/components/EventPin.tsx / POIPin.tsx**: Updated to support hybrid selection states.
- **Performance**: Significant reduction in main-thread overhead and elimination of visual "jumpiness".
