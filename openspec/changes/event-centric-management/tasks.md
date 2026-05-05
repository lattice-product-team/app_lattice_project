## 1. UI Navigation & Routing

- [x] 1.1 Update `SidebarNav` to replace "Venues" with a top-level "Points of Interest" link.
- [x] 1.2 Add an event context indicator (subtitle) to the "Points of Interest" nav item.
- [x] 1.3 Remove or redirect the `/venues` route in `admin-web` to prevent access to the deprecated view.
- [x] 1.4 Ensure the "Points of Interest" route (`/pois`) correctly reads the current active `eventId`.

## 2. Backend & API Adjustments

- [x] 2.1 Update the `geo` service API endpoints for POIs to accept and filter by `eventId` exclusively.
- [x] 2.2 Update the `gateway` service proxy configurations to pass `eventId` for spatial queries.
- [x] 2.3 Modify the database queries in `packages/db` to fetch and save `boundary` and `center` at the `events` level if they are not already doing so.

## 3. Map Editor Integration

- [x] 3.1 Update the Map Editor page (`/map`) to require and display the context of the active Event.
- [x] 3.2 Refactor the map saving logic so drawn polygons (boundaries) and center coordinates are saved directly to the `eventId`.
- [x] 3.3 Ensure that when an administrator places a new POI on the canvas, it is submitted with the active `eventId` (and no `venueId`).

## 4. Discovery & Verification

- [x] 4.1 Update the Event Operations Dashboard telemetry and summary cards to query based on `eventId` spatial bounds.
- [x] 4.2 Verify that child POIs only appear on the map when their parent Event is active or selected.
