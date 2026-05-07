## 1. Style System & Components

- [x] 1.1 Create `MapPinFrame` base component for consistent circular clipping and shadows.
- [x] 1.2 Implement `EventMarker` using the new frame and rich image support.
- [x] 1.3 Implement `POIMarker` for minimalist category-based glyphs.
- [x] 1.4 Centralize map pin styles in a new style file (`src/styles/mapPinStyles.ts`).

## 2. Refactor MapLayers

- [x] 2.1 Remove all legacy `SymbolLayer` and `CircleLayer` logic for events and POIs in `MapLayers.tsx`.
- [x] 2.2 Implement unified `MarkerView` rendering logic for all dynamic entities.
- [x] 2.3 Apply standardized `anchor={{ x: 0.5, y: 1.0 }}` to all `MarkerView` instances.
- [x] 2.4 Re-implement label rendering logic to ensure visibility and prevent Android clipping.

## 3. Performance & Visibility

- [x] 3.1 Implement JS-side visibility culling based on throttled zoom and viewport bounds.
- [x] 3.2 Optimize marker components with `React.memo` and efficient prop passing.
- [x] 3.3 Verify 60fps performance on Android during rapid interaction.

## 4. Verification

- [x] 4.1 Verify that markers remain perfectly pinned to coordinates during map tilt (3D) and rotation.
- [x] 4.2 Confirm that labels are legible and correctly positioned in all themes.
- [x] 4.3 Test selected state transitions and scaling animations.
