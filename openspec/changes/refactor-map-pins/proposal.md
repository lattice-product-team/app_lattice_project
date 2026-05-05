## Why

The current map pin system suffers from visual instability, specifically the "top-left jump" (0,0 coordinate flash) on mount and during rapid camera movements. Additionally, the transition between high-level Event pins and detailed sub-POI pins lacks the "approaching" fluidity requested by the user, currently relying on hard selection or geofencing rather than intuitive zoom-based discovery.

## What Changes

- **POI Pin Stability**: Migrate "Simple" sub-POI pins from `MarkerView` to `SymbolLayer`. This ensures 60FPS performance and eliminates any positioning bugs (like the top-left jump) as they are rendered directly by the map engine.
- **Event Pin Optimization**: Enhance `EventPin` (`MarkerView`) with a robust "projection sync" mechanism to prevent the (0,0) jump on mount.
- **Approaching Discovery**: Implement a zoom-based visibility hierarchy where sub-POIs fade in as the user zooms into an event's area, even without manual selection.
- **Visual Polish**: Refine pin aesthetics for better legibility at various zoom levels and ensure smooth cross-platform (iOS/Android) parity.

## Capabilities

### New Capabilities
- `zoom-based-discovery`: Logic for revealing sub-POIs based on camera proximity/zoom level.

### Modified Capabilities
- `map-pin-components`: Update visuals for "Simple" pins and add technical requirements for positioning stability.
- `spatial-hierarchy-logic`: Update visibility rules to include zoom-based reveal.

## Impact

- `apps/mobile/src/features/map/components/MapContent.tsx`: Refactor layer orchestration.
- `apps/mobile/src/features/map/components/MapInteractionLayer.tsx`: Handle new hierarchical rendering.
- `apps/mobile/src/features/map/components/POIPin.tsx`: Potentially deprecate or repurpose for "Selected" states only.
- `apps/mobile/src/features/poi/store/usePOIStore.ts`: Update filtering logic to support zoom-based proximity.
- `apps/mobile/src/features/map/components/MapLayers.tsx`: Add the new `SymbolLayer` for POIs.
