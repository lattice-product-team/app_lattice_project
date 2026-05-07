## 1. Backend API Enhancements

- [x] 1.1 Implement `POST /api/v1/events` endpoint in `geo-service` to support individual event creation with boundary.
- [x] 1.2 Implement `POST /api/v1/pois` endpoint in `geo-service` to support individual POI creation linked to an event.
- [x] 1.3 Add validation to ensure POI coordinates are within the parent event's boundary (optional but recommended).
- [x] 1.4 Update `GET /api/v1/pois` to ensure it returns parent event metadata for global mapping.

## 2. Shared Map Components

- [x] 2.1 Create `AdminMap` component in `apps/admin-web/src/components/map/admin-map.tsx` with basic MapLibre setup.
- [x] 2.2 Implement `useMapInteractions` hook to handle `GLOBAL_VIEW`, `DRAW_BOUNDARY`, and `PICK_COORDINATE` modes.
- [x] 2.3 Implement the UI for the boundary drawing tool (Undo, Clear, Close Loop).
- [x] 2.4 Implement the UI for the coordinate picker tool (Marker drop).

## 3. Event Creation Refactor

- [x] 3.1 Create `CreateEventModal` or multi-step form in `app/events/page.tsx`.
- [x] 3.2 Integrate `AdminMap` into the "Step 1: Define Boundary" part of the event creation flow.
- [x] 3.3 Connect the "Create" button to the new `POST /api/v1/events` endpoint.

## 4. POI Creation Refactor

- [x] 4.1 Create `RegisterAssetModal` in `app/pois/page.tsx`.
- [x] 4.2 Implement the "Select Event" dropdown as the first step.
- [x] 4.3 Integrate `AdminMap` into "Step 2: Place Pin", passing the selected event's boundary as an overlay.
- [x] 4.4 Connect the "Confirm" button to the new `POST /api/v1/pois` endpoint.

## 5. Global Map Refactor

- [x] 5.1 Rename and refactor `app/map/page.tsx` to use the `GLOBAL_VIEW` mode of `AdminMap`.
- [x] 5.2 Implement the "Event Layers" side panel to toggle visibility of different events and their assets.
- [x] 5.3 Implement the detail panel that opens when clicking a map asset.

## 6. Verification and Synchronization

- [ ] 6.1 Verify that creating an event in Admin Web immediately shows the boundary in the Mobile App.
- [ ] 6.2 Verify that placing a pin in Admin Web immediately shows the marker in the Mobile App.
- [ ] 6.3 Run a full regression test of the map layers in the mobile emulator/device.
