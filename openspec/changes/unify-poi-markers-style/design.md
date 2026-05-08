## Context

Currently, POIs are rendered using GL layers (`CircleLayer`, `SymbolLayer`) for performance, while Events use `MarkerViews` for high-quality visuals. This project aims to bring the premium visual quality of Events to all POIs by switching them to `MarkerViews` and unifying their design language.

## Goals / Non-Goals

**Goals:**
- Implement a unified "Bubble" style for all map markers.
- Replace GL-based POIs with `POIMarker` components (MarkerView).
- Use local PNG icons for better reliability and visual consistency.
- Implement smooth, non-bouncy scaling animations for POIs.

**Non-Goals:**
- Adding images to POIs (they will remain icon-based to differentiate from Events).
- Changing the underlying GeoJSON data structure.

## Decisions

- **Decision: Component-based POIs**: We will use `POIMarker` inside `MapLibreGL.MarkerView` for all visible POIs.
  - *Rationale*: Allows for using the same `MapPinFrame` and Reanimated logic as Events, ensuring a perfectly consistent look and feel.
  - *Alternatives*: Keeping GL layers and trying to mimic the style with SDF icons. Rejected because GL layers are less flexible for complex framing and animations.
- **Decision: Local PNG Icons**: All POI markers will use the local assets in `assets/icons/`.
  - *Rationale*: Eliminates 404 errors and network dependency. High-quality PNGs look sharper than small vector icons when scaled.
- **Decision: Category-based Coloring**: Each `POIMarker` will use a background color derived from its category metadata.
  - *Rationale*: Improves scannability of the map.

## Risks / Trade-offs

- **[Risk] Performance Jitter** → Mitigation: Use strict zoom filtering (`minZoomLevel={16.0}`) to ensure only a manageable number of `MarkerViews` are active at once.
- **[Risk] Asset Management** → Mitigation: Centralize all icon requires in `MapImageManager.tsx` or similar utility.
