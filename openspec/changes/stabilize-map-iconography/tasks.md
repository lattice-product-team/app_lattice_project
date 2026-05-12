## 1. Iconography Standardization

- [x] 1.1 Refactor `src/utils/poiUtils.ts` to use Lucide components with `strokeWidth={2.5}` for all markers.
- [x] 1.2 Verify all category mappings in `poiUtils.ts` match the design system.
- [x] 1.3 Ensure the `getCategoryMetadata` utility returns a consistent `CategoryMetadata` object with the correct Lucide icon.

## 2. Marker Shield Implementation

- [x] 2.1 Update `mapPinStyles.ts` to include a stabilized `markerWrapper` with explicit dimensions (120x80) and centered content.
- [x] 2.2 Refactor `MapPinFrame.tsx` to remove any conflicting layout properties and ensure consistent white bubble framing.
- [x] 2.3 Standardize the pin sizes (`eventPinSize`, `poiPinSize`) within the shield for both platforms.

## 3. Map Layer Orchestration

- [x] 3.1 Update `MapLayers.tsx` to use the "Layout Shield" `View` around all `MarkerView` instances.
- [x] 3.2 Implement the 13.0 zoom threshold for POI visibility in `MapLayers.tsx` for earlier discovery.
- [x] 3.3 Ensure unique and persistent keys for all `MarkerView` components using the `ev-mv-` and `poi-mv-` prefixes.
- [x] 3.4 Verify that `selectedEventId` and `selectedPoiId` logic correctly overrides zoom visibility.

## 4. UI Refinement & Validation

- [x] 4.1 Update `EventMarker.tsx` and `POIMarker.tsx` to use the standardized Lucide icon resolution from the registry.
- [x] 4.2 Verify correct anchor positioning (`0.5, 1.0`) for all pin-style markers to ensure they stay pinned to the coordinate.
- [x] 4.3 Remove any temporary debug code or legacy `PointAnnotation` overrides in `MapLayers.tsx`.
