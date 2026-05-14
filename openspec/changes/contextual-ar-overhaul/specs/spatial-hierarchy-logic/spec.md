## MODIFIED Requirements

### Requirement: Hierarchical Visibility

The system SHALL manage sub-POI visibility through a combination of explicit selection, geofencing, or zoom-based proximity.

#### Scenario: Selection Reveal

- **WHEN** an Event is selected
- **THEN** the system SHALL reveal all sub-POIs associated with that Event regardless of zoom level

#### Scenario: Zoom Proximity Reveal

- **WHEN** the user zooms into an area containing an Event (Zoom > 14.5)
- **THEN** the system SHALL reveal sub-POIs for that Event to encourage exploration

#### Scenario: Geofence Reveal

- **WHEN** the user's location is detected within the defined geofence (boundary polygon) of an Event
- **THEN** the system SHALL automatically reveal all sub-POIs for that Event without requiring selection
- **AND** the system SHALL signal the AR layer to switch to Event-Scale mode.
