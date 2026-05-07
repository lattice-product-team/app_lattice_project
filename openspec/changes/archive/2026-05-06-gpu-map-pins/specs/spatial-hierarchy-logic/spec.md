## ADDED Requirements

### Requirement: Zoom-based Discovery
The system SHALL automatically reveal associated sub-POIs as the user zooms into an event's geographic area, regardless of selection state.

#### Scenario: Approaching Zoom
- **WHEN** the map zoom level exceeds 16.5
- **THEN** sub-POIs in the current viewport SHALL become visible using a smooth opacity transition.

## MODIFIED Requirements

### Requirement: Hierarchical Visibility
The system SHALL hide all sub-POIs by default and only show them under specific conditions (Selection, Geofence, or Zoom).

#### Scenario: Selection Reveal
- **WHEN** an Event is selected
- **THEN** the system SHALL reveal all sub-POIs associated with that Event.

#### Scenario: Geofence Reveal
- **WHEN** the user's location is detected within the defined geofence of an Event
- **THEN** the system SHALL automatically reveal all sub-POIs for that Event without requiring selection.
