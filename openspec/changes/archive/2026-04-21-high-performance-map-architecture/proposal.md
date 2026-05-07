## Why

Formalize and optimize the mobile map architecture to ensure high performance, scalability for thousands of POIs, and native-feeling interactivity. This change transitions the map from a standard implementation to a production-grade spatial engine capable of handling complex spatial data and smooth HUD transitions.

## What Changes

- **Native Clustering**: Implement GPU-accelerated clustering for POIs and saved locations using MapLibre `cluster` properties.
- **HUD Decoupling**: Refactor the main map screen to strictly separate the Map engine from interactive UI layers (Search, Sheets, Carousels) to minimize re-renders.
- **State Optimization**: Refine selection logic in `useMapStore` to use atomic selectors and prevent mass component re-mounting during POI selection.
- **Enhanced Map Configuration**: Standardize styles, hitbox management, and error handling within `MapContent`.

## Capabilities

### New Capabilities

- `native-marker-clustering`: Provides GPU-accelerated marker aggregation for high-density point data.
- `high-performance-map-hud`: A framework for overlaying interactive UI components (HUD) over a map without degrading gesture performance.

### Modified Capabilities

- `decoupled-location-management`: Refine high-frequency updates to synchronize smoothly with camera movement without JS bridge saturation.

## Impact

- `apps/mobile/app/(main)/index.tsx`: Core screen refactoring.
- `apps/mobile/src/components/map/MapContent.tsx`: Layering and clustering logic.
- `apps/mobile/src/store/useMapStore.ts`: State management refinement.
- `apps/mobile/src/styles/mapLayerStyles.ts`: Add styles for clusters and new marker states.
