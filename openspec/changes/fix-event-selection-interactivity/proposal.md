## Why

After implementing wider zoom thresholds, event selection became unreliable. Users reported that closing an event and clicking it again wouldn't trigger the camera or sheet, and map clicks on events were often ignored. This is caused by incomplete state clearing in the POI store and GL-layer occlusion of native map annotations.

## What Changes

- **Complete State Reset**: Update `deselect` action to clear `selectedEventId`.
- **Map Layer Reordering**: Move the Events layer (Native PointAnnotations) to be rendered after the POI layer (GL) to ensure they receive touch events.
- **Enhanced Touch Handling**: Move the `onPress` handler from the internal `TouchableOpacity` to the `MapLibreGL.PointAnnotation` component for better cross-platform reliability.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `poi-selection-logic`: Update store to handle full deselection.
- `map-layer-hierarchy`: Adjust rendering order to prevent touch occlusion.

## Impact

- `apps/mobile/src/features/poi/store/usePOIStore.ts`
- `apps/mobile/src/features/map/components/MapLayers.tsx`
