## 1. Cleanup & Foundation

- [x] 1.1 Remove `MapVirtualOverlay.tsx` and all redundant imports.
- [x] 1.2 Delete `useMapProjection.ts` hook.
- [x] 1.3 Fix `mapStyle` in `MapContent.tsx` to ensure all vector sources are correctly merged.
- [x] 1.4 Clean up `MapLayers.tsx` and `MapInteractionLayer.tsx` from virtual-overlay legacy code.

## 2. GPU Image Management

- [x] 2.1 Implement `MapImageManager` to handle remote event image registration in `<MapLibreGL.Images>`.
- [x] 2.2 Add placeholder icon logic for pending or failed image loads.
- [x] 2.3 Integrate image registration lifecycle with the `allEvents` data stream.

## 3. High-Performance GPU Layers

- [x] 3.1 Implement the 3-layer Hero Event stack in `MapLayers.tsx` (Shadow Circle, Body Circle, Symbol Icon).
- [x] 3.2 Configure hierarchical zoom visibility (Events visible early, POIs fading in at Z>16.5).
- [x] 3.3 Implement vector-based POI layer using standard Maki icons for secondary points.
- [x] 3.4 Apply `iconPitchAlignment: 'viewport'` to all symbols to ensure 3D billboarding stability.

## 4. Interaction & Performance

- [x] 4.1 Restore stable `ShapeSource` press handlers for events and POIs.
- [x] 4.2 Implement smooth scaling animations for selected pins using GPU expressions.
- [x] 4.3 Verify sub-pixel smoothness and zero flickering during rapid pan/zoom.
