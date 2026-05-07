# Tasks: Lattice Event Platform Transition

## Task Group 1: Database and Shared Packages

- [x] Create `venues` and `events` tables in `packages/db/src/schema.ts`.
- [x] Add `venue_id` FKs to existing schema (`points_of_interest`, `nodes`, `path_segments`).
- [x] Update `packages/types-schema` with new types for venues and events.
- [x] Generate and run Drizzle migrations.

## Task Group 2: Admin Web Core (`apps/admin-web`)

- [x] Bootstrap Next.js app in `apps/admin-web`.
- [x] Configure Tailwind CSS and shared UI library.
- [x] Create basic Auth and Layout structure.
- [x] Create CRUD views for Venues and Events.

## Task Group 3: Map Editor and Telemetry

- [x] Integrate MapLibre GL JS into the Admin Web app.
- [x] Implement Map Editor: Draw venue boundaries and place POIs via clicking on the map.
- [x] Implement Crowd Radar: Render heatmaps from telemetry logs.
- [x] Backend: Create endpoints for receiving telemetry (pings) from the mobile app.

## Task Group 4: Mobile App Dynamic Config

- [x] Backend: Create `/event/config` endpoint to return event-specific branding and map data.
- [x] Mobile: Update auth flow to fetch and store event config after ticket scan.
- [x] Mobile: Dynamically apply branding (colors, logos) from event config.
- [x] Mobile: Implement periodic background telemetry (pings) to the server.

## Task Group 5: End-to-End Testing

- [x] Seed a "Stage Venue" and "Music Festival" event.
- [x] Test the full flow: Scanned ticket -> Dynamic config -> Map view -> Telemetry Radar.
