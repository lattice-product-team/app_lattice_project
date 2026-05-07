## MODIFIED Requirements

### Requirement: Spatial Data Persistence

The system SHALL provide a mechanism to save and retrieve event-level spatial configurations (Boundaries and Points of Interest) created via the Admin Web.

#### Scenario: Saving an Event Map

- **WHEN** the user clicks "Save Event Map" in the Map Editor after drawing a boundary and adding pins
- **THEN** the system MUST persist the GeoJSON boundary directly to the `events` table and the individual markers to the `points_of_interest` table (linked via `event_id`) via the `geo` service.

### Requirement: Persistent Layer Rendering

The Map Editor SHALL automatically load and render any existing boundaries and POIs for a selected event upon initialization.

#### Scenario: Loading Existing Map

- **WHEN** a user enters the Map Editor and selects an event
- **THEN** the system SHALL fetch existing spatial data from the `geo` service and render them as static layers on the map.

### Requirement: Dynamic Mobile Synchronization

The mobile application SHALL dynamically fetch and render the event boundary and POIs defined in the Admin Web.

#### Scenario: Mobile Reflection of Web Changes

- **WHEN** a mobile user views an event map
- **THEN** the app SHALL render the exact boundary and POIs that were persisted from the Admin Web for that specific `event_id`.

## REMOVED Requirements

### Requirement: Saving a Venue Map

**Reason**: Replaced by event-level persistence.
**Migration**: Use the `events` table instead of `venues`.

### Requirement: Loading Existing Venue Map

**Reason**: Venues are no longer the root context for spatial data.
**Migration**: Fetch spatial data using the `event_id`.
