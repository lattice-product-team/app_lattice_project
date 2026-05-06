## 1. Backend & Data Layer

- [x] 1.1 Update `packages/db` schema to ensure `poi_type` and `boundary` fields are fully optimized for GeoJSON strings or geometry objects.
- [x] 1.2 Implement `GET /venues/:id/spatial` in the `geo` service to return boundaries and POIs as a unified GeoJSON object.
- [x] 1.3 Implement `POST /venues/:id/spatial` in the `geo` service to persist spatial configurations from the web editor.
- [x] 1.4 Add unit tests for the new `geo` service endpoints using Vitest.

## 2. Admin Web: Global Dashboard & UX

- [x] 2.1 Refactor `apps/admin-web/src/app/page.tsx` to fetch real metrics from the API (Active Events, Users).
- [x] 2.2 Update `apps/admin-web/src/components/sidebar-nav.tsx` to include a "Home" navigation link to `/`.
- [x] 2.3 Implement the "Operations Center" card layout for global multi-event monitoring.

## 3. Admin Web: Map Editor 2.0

- [x] 3.1 Replace `react-map-gl/maplibre` logic with the unified MapLibreGL engine and shared MapTiler styles.
- [x] 3.2 Implement the "Load" logic to fetch and render existing boundaries/pins when a venue is selected.
- [x] 3.3 Implement the "Save" logic to send current map state to the `geo` service.
- [x] 3.4 Enhance the POI creation UI to allow choosing Name and Type (WC, Restaurant, etc.) before placing the marker.

## 4. Mobile Synchronization

- [x] 4.1 Update `apps/mobile/src/features/map/components/MapContent.tsx` to fetch dynamic venue layers from the `geo` service.
- [x] 4.2 Ensure boundaries and custom POIs are rendered correctly with appropriate icons matching the web selection.
- [x] 4.3 Verify synchronization end-to-end: Draw on Web -> Save -> See on Mobile.
