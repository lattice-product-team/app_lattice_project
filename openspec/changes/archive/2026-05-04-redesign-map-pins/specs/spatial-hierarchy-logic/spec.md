## ADDED Requirements

### Requirement: Hierarchical Visibility

The system SHALL hide all sub-POIs by default and only show them under specific conditions.

#### Scenario: Selection Reveal

- **WHEN** an Event is selected
- **THEN** the system SHALL reveal all sub-POIs associated with that Event

#### Scenario: Geofence Reveal

- **WHEN** the user's location is detected within the defined geofence of an Event
- **THEN** the system SHALL automatically reveal all sub-POIs for that Event without requiring selection

### Requirement: Automatic Camera Focus

The system SHALL adjust the camera to ensure all relevant pins are visible upon selection.

#### Scenario: Event Focus

- **WHEN** an Event is selected
- **THEN** the system SHALL calculate the bounding box of all associated POIs and animate the camera to fit that region
