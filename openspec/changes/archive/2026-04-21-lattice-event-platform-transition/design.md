# Design: Lattice Event Platform Transition

## 1. Database Schema Refactor (PostgreSQL/PostGIS)

We need to shift from a single-venue approach to a multitenant one.

### New Tables:

- `venues`:
  - `id` (serial, PK)
  - `name` (varchar)
  - `boundary` (geometry, polygon) - Boundary of the venue.
  - `center` (geometry, point) - Center for map initialization.
  - `primaryColor` (hex code) - Venue branding.
- `events`:
  - `id` (serial, PK)
  - `venueId` (FK to `venues.id`)
  - `name` (varchar)
  - `startDate`, `endDate` (timestamp)

### Schema Updates:

- Add `venueId` FK to: `points_of_interest`, `nodes`, `path_segments`.
- Add `eventId` FK to: `tickets`.

## 2. Admin Web Dashboard (`apps/admin-web`)

A new React application (Next.js) will be built to handle event management.

### Key Components:

- **Map Editor**: Using MapLibre GL JS to let admins draw venue boundaries and place POIs.
- **Crowd Radar**: Visualization of real-time telemetry from the mobile app (Heatmaps).
- **Event Manager**: CRUD for venues and events.

## 3. Backend (Microservices)

- **Shared packages**: Update `packages/db` and `packages/types-schema` to reflect the new multitenant structure.
- **Geo Service**: Filter queries (POIs, routing) by `venueId`.
- **Telemetry**: New endpoints to receive periodic location pings from the mobile app.

## 4. Mobile App (Expo)

- **Auth Flow**: After scanning a ticket, fetch event-specific configuration from the backend.
- **Dynamic UI**: Use the `primaryColor` from the event config for the UI theme.
- **Background Telemetry**: Send low-frequency location updates to the backend for the "Crowd Radar".
