## MODIFIED Requirements

### Requirement: Zoom-based Discovery

The system SHALL automatically reveal associated sub-POIs as the user zooms into an area, regardless of selection state.

#### Scenario: Approaching Zoom

- **WHEN** the map zoom level exceeds 16.5
- **THEN** sub-POIs in the current viewport SHALL become visible
- **AND** their transition SHALL be optimized to prevent UI thread blocking when many `MarkerView` instances are mounted simultaneously

### Requirement: Hierarchical Visibility

The system SHALL manage sub-POI visibility through a combination of explicit selection, geofencing, or zoom-based proximity.

#### Scenario: Selection Reveal

- **WHEN** an Event is selected
- **THEN** the system SHALL reveal all sub-POIs associated with that Event regardless of zoom level

#### Scenario: Zoom Proximity Reveal

- **WHEN** the user zooms into an area containing an Event (Zoom > 14.5)
- **THEN** the system SHALL reveal sub-POIs for that Event to encourage exploration

#### Scenario: Geofence Reveal

- **WHEN** the user's location is detected within the defined geofence of an Event
- **THEN** the system SHALL automatically reveal all sub-POIs for that Event without requiring selection
