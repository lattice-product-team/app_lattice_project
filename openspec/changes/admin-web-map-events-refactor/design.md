## Context

The current spatial management is coupled with a "Canvas" concept in `MapEditorPage` where all changes for a single event are saved at once. This design refactors it to a distributed model where spatial data is captured at the source (Event/POI creation) and visualized globally.

## Goals / Non-Goals

**Goals:**
- Decouple spatial data entry from the visualization map.
- Implement a global visualizer for all active events and their assets.
- Provide contextual spatial selection (e.g., seeing a boundary when placing a POI).
- Ensure 1:1 synchronization with the mobile application's map layers.

**Non-Goals:**
- Real-time collaborative editing of boundaries.
- Support for complex multi-polygon boundaries.
- Modification of the mobile app's rendering logic (reuse existing layers).

## Decisions

### 1. Shared `AdminMap` Component
**Decision**: Create a highly configurable `AdminMap` component in `apps/admin-web/src/components/map/admin-map.tsx`.
**Rationale**: Centralizing map logic ensures consistent styling (Maptiler), control handling, and layer management across the global view, event creation, and POI creation.
**Alternatives**: duplicating map logic in each page (leads to drift) or using raw MapLibre (harder to integrate with React state).

### 2. Interaction Modes
**Decision**: The `AdminMap` will support three distinct `InteractionModes`:
- `GLOBAL_VIEW`: Read-only, cluster-enabled (if needed), shows all events.
- `DRAW_BOUNDARY`: Clicking on the map adds points to a polygon.
- `PICK_COORDINATE`: Clicking on the map places a single marker; shows a boundary overlay if `eventId` is provided.

### 3. RESTful API Evolution
**Decision**: Move away from `POST /events/:id/spatial` (bulk save) towards individual resource endpoints:
- `POST /api/v1/events`: Creates the event record including the boundary.
- `POST /api/v1/pois`: Creates a POI record associated with an `eventId`.
**Rationale**: Improves auditability and reduces the risk of overwriting data during bulk saves.

### 4. Data Sincronization
**Decision**: Use existing PostGIS geometry storage.
**Rationale**: The mobile app already consumes GeoJSON from the `geo-service`. By keeping the storage format consistent, no mobile-side changes are required.

## Risks / Trade-offs

- **[Risk]** Complexity of drawing polygons in React. → **Mitigation**: Use `react-map-gl` handles and a simple state array for points, with an "Undo" feature.
- **[Risk]** API Backward Compatibility. → **Mitigation**: Keep the `spatial` bulk endpoint as "Legacy" for a transition period if other internal tools use it.
- **[Risk]** Mobile Cache Invalidation. → **Mitigation**: Ensure the mobile app's `geoService` doesn't aggressively cache results or uses appropriate ETag/Cache-Control headers.
