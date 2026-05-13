## ADDED Requirements

### Requirement: Location-Aware Sorting
The proximity engine SHALL sort "Nearby Now" items based on the user's real-time geographic coordinates.

#### Scenario: Sorting by distance
- **WHEN** the "Nearby Now" section is requested with `lat` and `lng` parameters
- **THEN** the system SHALL return a list of items sorted from closest to farthest from those coordinates.

### Requirement: Proximity Badge
Items in the "Nearby Now" list SHALL display their distance from the user.

#### Scenario: Visualizing distance
- **WHEN** an item is rendered in the "Nearby" list
- **THEN** it SHALL show a badge with the distance in kilometers (e.g., "0.5 km").
