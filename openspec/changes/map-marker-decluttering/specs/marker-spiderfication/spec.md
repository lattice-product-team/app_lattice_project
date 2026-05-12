## ADDED Requirements

### Requirement: Spiderfication Algorithm
The system SHALL implement a coordinate-offset algorithm that spreads overlapping markers when the map zoom level exceeds a specific threshold.

#### Scenario: Spreading overlapping markers
- **WHEN** multiple features share coordinates (or are within 10 meters)
- **AND** the map zoom level is greater than 17
- **THEN** each marker SHALL be assigned an offset position in a circular pattern around the original coordinate
- **AND** the original coordinate SHALL remain stored as the true location for data integrity.

### Requirement: Spider-Leg Visuals
The system SHALL optionally display a connecting line between the original coordinate and the offset marker position to maintain spatial context.

#### Scenario: Displaying connections
- **WHEN** a marker is displaced by the spiderfication algorithm
- **THEN** a subtle line (1px width, theme-based color) SHOULD be rendered connecting the pin to its true anchor point.
