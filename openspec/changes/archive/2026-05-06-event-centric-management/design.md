## Context

The Lattice platform originally modeled Points of Interest (POIs) as belonging to physical Venues. The UI has been updated to reflect an event-centric paradigm where POIs are nested under the current Event. The backend database still supports `venueId` but we will shift UI and API usage to rely exclusively on `eventId`.

## Goals / Non-Goals

**Goals:**
- Update `admin-web` routing and layout to reflect `Events > POIs` hierarchy.
- Ensure the Map Editor saves bounds, center, and POIs directly associated with an `eventId`.
- Provide a smooth UI transition for administrators without losing existing data.

**Non-Goals:**
- Completely dropping the `venues` table from the database (we will keep it for backward compatibility and potential future structural use, but hide it from the UI).
- Migrating all existing Venue POIs to Event POIs automatically (will require a separate data migration script if needed).

## Decisions

**1. UI Sidebar Hierarchy**
- **Decision**: Show "Points of Interest" as a sub-navigation item under "Events", displaying the currently active Event.
- **Rationale**: Keeps the user constantly aware of which Event context they are editing. It maintains the existing clean aesthetic while solving the navigation problem.

**2. API Query Parameters**
- **Decision**: Update backend endpoints (e.g., in `geo` and `gateway`) to fetch `/pois?eventId=XYZ` instead of `venueId`.
- **Rationale**: Direct association. If an event doesn't have its own POIs yet, it can be cloned or start empty, rather than sharing a global Venue state which causes conflicts.

**3. Map Editor Context**
- **Decision**: The map editor (`/map` route) must receive an `eventId` parameter or rely on a global event context state to know where to save the spatial data.
- **Rationale**: Without a venue to attach to, the event itself must store `boundary` and `center` coordinates.

## Risks / Trade-offs

- **Risk: Orphaned POIs**
  - *Trade-off*: Existing POIs attached only to a `venueId` will no longer be visible if we strictly query by `eventId`.
  - *Mitigation*: We may need a fallback or a one-time migration to assign `eventId` to these POIs based on active events at that venue.
- **Risk: Global Map State**
  - *Trade-off*: Navigating directly to `/map` without selecting an event first might lead to an undefined state.
  - *Mitigation*: Add an "Event Selector" dropdown or force the user to select an event before entering the map editor.
