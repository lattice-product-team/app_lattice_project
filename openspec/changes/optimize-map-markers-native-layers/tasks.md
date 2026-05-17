## 1. Asset & Registry Preparation

- [x] 1.1 Convert POI category icons to monochrome, high-contrast SVG assets suitable for SDF rendering.
- [x] 1.2 Update `MapImageManager.tsx` to register the new monochrome icons with the `sdf: true` flag.

## 2. Server-Side / Data Enrichment

- [x] 2.1 Ensure the GeoJSON output for POIs and Events includes necessary properties: `icon_name`, `color_hex`, and `display_name`.

## 3. Native Layer Implementation

- [x] 3.1 Refactor `MapLayers.tsx` to implement a `SymbolLayer` for POIs that uses `['get', 'icon_name']` and `['get', 'color_hex']` for styling.
- [x] 3.2 Implement `CircleLayer` (background) and `SymbolLayer` (text label with halo) for Events in `MapLayers.tsx`.
- [x] 3.3 Configure native clustering on the `ShapeSource` for POIs to handle high-density areas.

## 4. Hybrid Selection Logic

- [x] 4.1 Implement a `filter` expression on the native layers to hide the currently selected feature by ID.
- [x] 4.2 Update the main map component to mount a single React Native `PointAnnotation` specifically for the selected feature to allow for complex animations.

## 5. Performance & Visual Validation

- [x] 5.1 Profile the map interaction on an older Android device to verify consistent frame rates (aiming for 60 FPS).
- [x] 5.2 Validate that text labels are readable over all map terrain using the new native halo styling.
