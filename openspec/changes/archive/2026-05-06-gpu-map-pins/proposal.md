## Why

The current map pin system has undergone multiple iterations trying to balance React-level flexibility with native performance, leading to persistent flickering, "teleporting" pins, and synchronization issues. To achieve a premium, Apple-inspired experience, we must fully embrace the map's GPU engine (SymbolLayer) for all marker types, eliminating the React-Native bridge overhead for positioning.

## What Changes

- **GPU-Only Rendering**: Migration of all map markers (Events and POIs) to `SymbolLayer` and `CircleLayer` within the MapLibre engine.
- **Dynamic Texture Injection**: Implementation of a robust system to download, cache, and register remote event images as icons in `MapLibreGL.Images`.
- **Vector POI System**: Implementation of a scalable GeoJSON-driven POI layer using standard iconography for secondary points (restaurants, toilets, etc.).
- **Deprecation of React Overlays**: Removal of `MapVirtualOverlay`, `useMapProjection`, and all legacy `MarkerView`/`PointAnnotation` implementations to ensure a single source of truth for map rendering.

## Capabilities

### New Capabilities

- `gpu-image-registry`: A centralized manager to handle remote image fetching and registration into the map's texture atlas.

### Modified Capabilities

- `map-pin-components`: Update definition to support GPU-based rendering properties instead of native view props.
- `spatial-hierarchy-logic`: Refine visibility thresholds to work seamlessly with GPU layer filters (`minZoomLevel`, `filter`).

## Impact

- `apps/mobile/src/features/map/components/MapContent.tsx`: Refactor to remove overlay logic and manage image registration.
- `apps/mobile/src/features/map/components/MapLayers.tsx`: Define the new `SymbolLayer` hierarchy for events and POIs.
- `apps/mobile/src/features/map/components/MapVirtualOverlay.tsx`: **DELETE** (Redundant).
- `apps/mobile/src/features/map/hooks/useMapProjection.ts`: **DELETE** (Redundant).
