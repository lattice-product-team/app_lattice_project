## Why

The map currently suffers from visual clutter where Event markers and their child POI markers (like stages, restrooms, etc.) overlap at medium zoom levels. This creates an unappealing "mess" of icons and makes it difficult for users to distinguish the main event from its internal features. We need a hierarchical visibility system to ensure a clean, premium exploration experience.

## What Changes

- **Hierarchical Visibility (LOD)**: POIs belonging to an event will be hidden at lower zoom levels and only "blossom" when the user zooms in sufficiently.
- **Event-POI Occlusion**: The main Event marker will transition to a more subtle state (mini-marker) when its child POIs become visible to avoid occlusion.
- **Contextual Discovery**: If an event is selected, its internal POIs will be prioritized for visibility regardless of the global zoom threshold.

## Capabilities

### New Capabilities

- **map-marker-hierarchy**: Logic to manage parent-child relationships between map markers and their visibility thresholds.
- **lod-visibility-engine**: A system to handle smooth transitions and fading of markers based on zoom level.

### Modified Capabilities

- **navigation-system**: Update to handle POI visibility during active navigation to a specific event.

## Impact

- `MapLayers.tsx`: Significant refactoring of the marker rendering and filtering logic.
- `usePOIStore.ts`: Added logic for hierarchical filtering.
- `EventMarker.tsx` & `POIMarker.tsx`: New props for visibility states and mini-modes.
