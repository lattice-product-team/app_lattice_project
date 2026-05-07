## ADDED Requirements

### Requirement: Perpetual Event Context

The system SHALL support events marked as "permanent" which act as perpetual spatial containers for points of interest and navigation data.

#### Scenario: Defining a permanent venue-event

- **WHEN** an administrator creates an event and sets the `is_permanent` flag to true
- **THEN** the system MUST treat this event as a long-term container that doesn't expire in the discovery UI.

### Requirement: Venue-to-Event Data Migration

The system SHALL provide a migration path to move existing Venue spatial data (boundary, center) into their primary associated Event.

#### Scenario: Migrating Circuit de Catalunya

- **WHEN** the migration is executed
- **THEN** the boundary and center coordinates from the "Circuit de Barcelona-Catalunya" venue MUST be transferred to the "Nitro GP Barcelona" event (or its permanent equivalent).
