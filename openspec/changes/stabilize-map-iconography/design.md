## Context

The application uses `lucide-react-native` for map markers. On iOS, `MarkerView` components often fail to render or exhibit size calculation errors when they contain nested React views or complex styles. Currently, some pins are invisible due to these rendering inconsistencies, which negatively affects the user experience and map reliability.

## Goals / Non-Goals

**Goals:**
- Guarantee 100% visibility of all map markers on both iOS and Android.
- Standardize the `MarkerView` container architecture using the "Marker Shield" pattern (explicit static dimensions).
- Unify the iconography system to Lucide with consistent stroke weights (2.2 for general UI, 2.5 for map markers).
- Improve performance by reducing redundant re-renders of the marker layer through discrete zoom logic.

**Non-Goals:**
- Migrating to a different map engine (keeping MapLibre).
- Overhauling the search or routing backend logic.
- Adding new marker categories not present in the current dataset.

## Decisions

### 1. The "Marker Shield" Pattern
- **Decision**: Every `MarkerView` will be wrapped in a dedicated `View` with fixed, absolute dimensions (e.g., 120x80 wrapper with a 44x44 centered pin frame).
- **Rationale**: MapLibre iOS requires the native view host to have a non-zero size before the React views are fully hydrated. A static wrapper "shields" the internal React layout from these engine-specific quirks.
- **Alternatives**: Using `PointAnnotation`. Considered but rejected as `MarkerView` is more flexible for custom animations and React Native interactions when configured correctly with static bounds.

### 2. Unified Iconography Utility (`poiUtils.ts`)
- **Decision**: Centralize all icon mappings and metadata in `poiUtils.ts`.
- **Rationale**: Ensures visual consistency and simplifies maintenance. All markers (POI and Events) will use this utility to resolve their visual state.
- **Implementation**: The utility will return Lucide components directly as part of the category metadata.

### 3. Hierarchical Visibility & Discrete Zoom
- **Decision**: Implement a two-tier visibility system. Standard POIs appear at zoom > 13.5, while events and selected items are always visible.
- **Rationale**: Prevents map clutter and improves frame rates by limiting the number of active `MarkerView` instances on the screen at low zoom levels.

## Risks / Trade-offs

- **[Risk] Coordinate offset due to shield size** → [Mitigation] Use a standard `anchor={{ x: 0.5, y: 1.0 }}` across all markers and ensure the pin frame is bottom-aligned within the 120x80 wrapper.
- **[Risk] Memory overhead with high marker counts** → [Mitigation] Implement strict filtering in `MapContent.tsx` so only POIs relevant to the current zoom level and area are mounted.
