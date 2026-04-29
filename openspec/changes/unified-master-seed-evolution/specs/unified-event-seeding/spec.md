## ADDED Requirements

### Requirement: Idempotent Master Seeding
The system SHALL provide a single command to reset and populate the database with a standard set of test events and geographical data.

#### Scenario: Running the master seed
- **WHEN** the command `npm run db:seed` is executed
- **THEN** all existing event-related data is cleared via cascading truncate
- **AND** three diverse events (Nitro GP, Neon Nights, Quantum Conf) are created in the Barcelona area
- **AND** all POIs and navigation nodes are correctly assigned to their respective events

### Requirement: Isolated Event Routing Graphs
The seeding process SHALL ensure that navigation nodes and segments are isolated per event to prevent cross-event routing interference.

#### Scenario: Verifying node isolation
- **WHEN** nodes are created for an event
- **THEN** each node MUST have a valid `event_id` foreign key
- **AND** segments MUST only connect nodes belonging to the same `event_id`

### Requirement: Accessibility Testing baseline
The seeding process SHALL include specific path segments with accessibility flags (e.g., `has_stairs: true`) to allow verification of the routing engine's accessibility logic.

#### Scenario: Seeded accessibility obstacles
- **WHEN** the Nitro GP event is seeded
- **THEN** at least one path segment MUST be created with `has_stairs: true`
- **AND** an alternative path segment MUST be created without stairs to allow for accessibility-aware routing tests
