## 1. Store Fixes

- [x] 1.1 Update `deselect` action in `usePOIStore.ts` to clear `selectedEventId`.

## 2. Map Layer Fixes

- [x] 2.1 Reorder layers in `MapLayers.tsx` to render the Events layer (PointAnnotations) AFTER the POI layer (ShapeSource).
- [x] 2.2 Add `onPress` handler directly to `MapLibreGL.PointAnnotation` in `MapLayers.tsx`.
- [x] 2.3 Remove the `onPress` from the internal `TouchableOpacity` in `EventMarker.tsx` to avoid double-triggers or blocked touches.

## 3. Verification

- [x] 3.1 Verify event selection from the map works reliably.
- [x] 3.2 Verify event selection after closing the details sheet works every time.
- [x] 3.3 Verify clicking empty map areas correctly deselects everything.
