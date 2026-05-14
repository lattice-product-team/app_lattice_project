## ADDED Requirements

### Requirement: Boundary-Aware AR Mode Switching
The system SHALL determine the AR display mode based on the user's intersection with event boundaries (polygons).

#### Scenario: User outside boundaries
- **WHEN** the user is not inside any event boundary
- **THEN** the system SHALL operate in "City-Scale" mode, displaying parent events as beacons.

#### Scenario: User inside boundary
- **WHEN** the user is inside an event's boundary
- **THEN** the system SHALL operate in "Event-Scale" mode, displaying POIs for that specific event.

### Requirement: Real-time Point-in-Polygon Check
The system SHALL perform a Point-in-Polygon check at a minimum frequency of 1Hz to ensure the AR mode is current.

#### Scenario: Entering an event boundary
- **WHEN** the user crosses from outside to inside an event boundary
- **THEN** the AR view MUST automatically transition from event beacons to event-specific POIs.

#### Scenario: Exiting an event boundary
- **WHEN** the user crosses from inside to outside an event boundary
- **THEN** the AR view MUST automatically transition from POIs back to event beacons.
