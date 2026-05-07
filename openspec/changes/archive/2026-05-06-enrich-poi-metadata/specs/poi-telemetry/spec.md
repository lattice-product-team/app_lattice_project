## ADDED Requirements

### Requirement: Real-time Occupancy Tracking

The system SHALL support tracking and displaying the current occupancy of a POI as a percentage of its total capacity.

#### Scenario: Occupancy update via telemetry

- **WHEN** a telemetry event reports new occupancy data for a POI ID
- **THEN** the system MUST update the `currentOccupancy` value and propagate it to the Admin dashboard in real-time.

### Requirement: Operational Status Management

The system SHALL allow administrators to set an operational status for each POI (e.g., "Open", "Closed", "Maintenance").

#### Scenario: Status change reflection

- **WHEN** an administrator changes the status of a POI to "Maintenance"
- **THEN** the map markers and detail sheets MUST reflect this status to prevent user frustration.
