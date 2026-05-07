## ADDED Requirements

### Requirement: Integrated Boundary Definition

The Event Creation flow SHALL include a mandatory step for defining the spatial perimeter of the event.

#### Scenario: Drawing a boundary during creation

- **WHEN** the user is in the "Create Event" wizard
- **THEN** they MUST be presented with a map interface where they can click to draw a polygon representing the event boundary.

### Requirement: Automatic Geocoding of Events

The system SHALL attempt to resolve a human-readable address based on the center of the drawn event boundary.

#### Scenario: Resolving event address

- **WHEN** the user completes a boundary drawing
- **THEN** the system SHALL call the reverse geocoding service and pre-populate the "Address" field in the event details.
