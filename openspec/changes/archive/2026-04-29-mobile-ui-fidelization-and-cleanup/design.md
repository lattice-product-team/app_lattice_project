## Context

The Lattice mobile app is in the middle of a transition to a "Feature-First" architecture. While the file structure has been improved, the visual layer remains fragmented. We are using a legacy `SearchBar` instead of the newly created `FloatingSearchBar`, and the map is cluttered with native POIs that confuse the user.

## Goals / Non-Goals

**Goals:**

- Unify the search experience using the `FloatingSearchBar`.
- Clear the map of all non-Lattice POIs.
- Resolve all icon-related console warnings.
- Delete all legacy map UI components to reduce bundle size and confusion.

**Non-Goals:**

- Implementing new features or map interactions.
- Changing the backend data structure.

## Decisions

### 1. Multi-Family Icon Metadata

Update `poiUtils.ts` to support both `Feather` and `MaterialCommunityIcons` explicitly.

- **Rationale**: Some niche categories (like specialized food types) are only available in Material, while core UI actions feel better in Feather.
- **Implementation**: Add `iconFamily: 'feather' | 'material'` to `CategoryMetadata`. Update components to branch based on this field.

### 2. Comprehensive Map Layer Hiding

Broaden the `layersToHide` list in `MapContent.tsx` to target MapTiler Streets v2 specific layers.

- **Target Layers**: `poi_transit`, `poi_education`, `poi_medical`, `poi_park`, `poi_worship`, `poi_other`, `transportation_name`, `amenity_point`, `education_point`.
- **Rationale**: Standard `poi` and `poi_label` are not enough for the full OpenMapTiles schema used by MapTiler.

### 3. Promotion of FloatingSearchBar

Replace all usages of `SearchBar` with `FloatingSearchBar`.

- **Rationale**: `FloatingSearchBar` implements the "Apple-style" glassmorphism and layout (height 54, radius 24) required for the premium feel.

## Risks / Trade-offs

- **[Risk] Missing Layers** → **Mitigation**: Use the MapLibre debugger if certain icons persist to find their exact layer IDs.
- **[Risk] Broken Icons** → **Mitigation**: Verify each category in the app after updating the metadata mapping.
