## 1. Store & State Optimization

- [x] 1.1 Refactor `useMapStore.ts` to use atomic selectors for `selectedPoiId` and `cameraState`.
- [x] 1.2 Implement a `setCamera` imperative utility in the store to bypass React for minor camera shifts.

## 2. MapContent & Native Layers

- [x] 2.1 Enable `cluster={true}` on `poisSource` in `MapContent.tsx`.
- [x] 2.2 Define and implement `clusterCircles` and `clusterLabels` layers in `mapLayerStyles.ts`.
- [x] 2.3 Refactor selection logic to use a filter-based approach (`['==', ['get', 'id'], selectedPoiId]`) on existing layers.

## 3. MapIndex & HUD Decoupling

- [x] 3.1 Refactor `MapIndex.tsx` into a controller-overlay pattern.
- [x] 3.2 Create a `MapHUD` component to host SearchBar, Sheets, and Carousels.
- [x] 3.3 Ensure `MapContent` is wrapped in `React.memo` and only receives static props or refs.

## 4. Performance & UX

- [x] 4.1 Implement `hitbox` optimizations for touch targets on clustered and non-clustered points.
- [x] 4.2 Add Haptic feedback to cluster expansion and POI selection.
- [x] 4.3 Verify gesture simultaneity between `MapLibre` and `@gorhom/bottom-sheet`.
