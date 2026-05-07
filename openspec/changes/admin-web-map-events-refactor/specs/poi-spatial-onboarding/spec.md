## ADDED Requirements

### Requirement: Event-Contextual POI Placement

The Point of Interest registration flow SHALL require the selection of a parent Event before allowing spatial placement.

#### Scenario: Selecting event context

- **WHEN** the user starts the "Register Asset" flow
- **THEN** they MUST select an Event from a list, which will then focus the map on that event's boundary for pin placement.

### Requirement: Constraint-Aware Pin Placement

The system SHALL visualize the parent event's boundary while the user is choosing the location for a new POI.

#### Scenario: Visualizing boundary during placement

- **WHEN** the user is in the "Pick Location" step of POI registration
- **THEN** the map MUST render the parent event's boundary as a semi-transparent overlay to provide spatial context.
