## 1. Core Logic & Store

- [x] 1.1 Update `usePOIStore.ts` with zoom-based visibility logic.
- [x] 1.2 Implement GeoJSON conversion for secondary POIs (SymbolLayer).

## 2. Virtual Overlay Infrastructure

- [x] 2.1 Create `useMapProjection.ts` hook to convert geographic coordinates to screen pixels using camera state.
- [x] 2.2 Develop `MapVirtualOverlay.tsx` as a transparent absolute layer on top of the MapView.
- [x] 2.3 Connect MapLibre's `onRegionIsChanging` to update the shared camera state (center, zoom, pitch).

## 3. Premium Event Pin (External)

- [x] 3.1 Rebuild `EventPin.tsx` as a pure React Native component (no MarkerView).
- [x] 3.2 Implement perfect circular clipping, borders, and shadows using standard CSS-in-JS.
- [x] 3.3 Use `useAnimatedStyle` to position pins based on projected screen coordinates.

## 4. Integration & Refinement

- [x] 4.1 Remove all `PointAnnotation` and `MarkerView` usage from `MapInteractionLayer`.
- [x] 4.2 Ensure click parity (Pressables) and z-index alignment with the discovery sheets.
- [x] 4.3 Verify sub-pixel smoothness during rapid panning and zooming.
