## 1. Asset Preparation

- [x] 1.1 Audit local icons in `apps/mobile/assets/icons/` to ensure all categories have a valid PNG.
- [x] 1.2 Verify that the `marker.png` (default) is present and high quality.

## 2. Refactor POIMarker Component

- [x] 2.1 Update `POIMarker.tsx` to use `useDerivedValue` and `withTiming` for smooth, non-bouncy animations.
- [x] 2.2 Standardize `POIMarker` visual style: White border, colored background pill, and local PNG icon.
- [x] 2.3 Ensure `POIMarker` correctly handles the `isSelected` state (scale 1.3, translate -10px).

## 3. Map Layers Integration

- [x] 3.1 Modify `MapLayers.tsx` to remove GL-based `CircleLayer` and `SymbolLayer` for POIs.
- [x] 3.2 Implement a new `MarkerView` loop for POIs using the `POIMarker` component.
- [x] 3.3 Apply strict `minZoomLevel={16.0}` to the POI `MarkerView` collection to maintain performance.
- [x] 3.4 Ensure the new POI markers use `anchor={{ x: 0.5, y: 1.0 }}` for correct positioning.

## 4. Polishing and Verification

- [ ] 4.1 Verify that tapping a POI triggers the same smooth animation as Events.
- [ ] 4.2 Confirm that category colors are correctly applied to the POI marker backgrounds.
- [ ] 4.3 Audit for any visual "jitter" or coordinate flashes during map transitions.
