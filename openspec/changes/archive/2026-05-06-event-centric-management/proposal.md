## Why

The current platform architecture separates spatial data into "Venues" and "Events", which creates unnecessary overhead for administrators. In reality, points of interest (POIs) and map boundaries are highly specific to the context of a particular Event. Shifting to an event-centric management model simplifies the administration dashboard, aligns the data model with the users' mental model, and streamlines the map editor experience.

## What Changes

- **Hide Venues from UI**: Remove the "Venues" section and references from the `admin-web` dashboard sidebar and routing.
- **Event-Level Map Boundaries**: The Map Editor should focus on defining the polygon boundaries and center directly at the Event level rather than relying on a base Venue.
- **Event-Level POIs**: All Points of Interest (POIs) management will be tied directly to an Event. The concept of "fixed venue POIs" will be deprecated in the UI in favor of event-specific POIs.
- **BREAKING**: Event creation and management will no longer require managing Venues first. Events become the top-level entity for spatial configuration.

## Capabilities

### New Capabilities

- `event-centric-map-editor`: A dedicated map editor capability that allows admins to define the geographical bounds, center, and POIs directly within the context of a specific Event.

### Modified Capabilities

- `event-operations-dashboard`: Update the dashboard requirements to remove Venue management and elevate Event management as the primary top-level entity.
- `event-poi-orchestration`: Modify POI management requirements so that POIs are exclusively linked to and managed through an Event context.

## Impact

- **admin-web**: Sidebar navigation (`SidebarNav`), routing, and Event management pages will be refactored. The Map Editor component will be updated to save data against the `eventId` instead of `venueId`.
- **Backend APIs (`geo` / `gateway`)**: API queries for POIs and boundaries will shift focus to querying by `eventId` rather than `venueId`.
- **Database Schema**: While `venues` may remain in the DB for historical reasons, the frontend and API will prioritize `boundary`, `center`, and POIs on the `events` table.
