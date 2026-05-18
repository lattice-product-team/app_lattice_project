## Why

The current map interface has a visual disconnect between "Events" (using rich MarkerViews with images and animations) and "POIs" (using standard GL-based SymbolLayers with simple icons). To achieve a premium "Midnight" aesthetic, all map elements should share a unified, high-quality visual language that feels cohesive and responsive.

## What Changes

- **Unified Marker Style**: Implement a new `POIMarker` component that shares the structural logic of `EventMarker` (using the `MapPinFrame` system).
- **Icon Strategy**: Migrate from generic internet-sourced icons to a curated set of high-quality local PNG icons for all POI categories.
- **Enhanced POI Interactions**: Add smooth scaling and translation animations to POIs when selected, matching the premium feel of the Event markers.
- **Hybrid to MarkerView Migration**: Transition POI rendering from `SymbolLayer` (GL) to `MarkerView` (React Native) to support complex layouts and animations while maintaining performance through existing zoom-based filtering.

## Capabilities

### New Capabilities

- `unified-marker-system`: Centralized logic for all map pin variants (Events, POIs, Saved places) ensuring consistent framing and animation behavior.

### Modified Capabilities

- `map-pin-components`: Update existing marker components to support the new unified pill/bubble aesthetic.
- `hybrid-map-rendering`: Adjust the rendering balance to favor MarkerViews for POIs while retaining GL for non-interactive elements.

## Impact

- **Affected Code**: `MapLayers.tsx`, `EventMarker.tsx`, `MapPinFrame.tsx`, `MapImageManager.tsx`, and a new `POIMarker.tsx`.
- **Assets**: New local icon set required in `apps/mobile/assets/icons/`.
- **Performance**: Increased pressure on the React Native bridge due to more `MarkerViews`; requires strict zoom-level filtering.
