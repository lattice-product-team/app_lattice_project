## MODIFIED Requirements

### Requirement: Hierarchical Visibility

The system SHALL manage sub-POI visibility through a combination of explicit selection, geofencing, and zoom-based proximity.

#### Scenario: Selection Reveal

- **WHEN** an Event is selected
- **THEN** the system SHALL reveal all sub-POIs associated with that Event regardless of zoom level

#### Scenario: Zoom Proximity Reveal

- **WHEN** the user zooms into an area containing an Event (Zoom > 14.5)
- **THEN** the system SHALL reveal sub-POIs for that Event to encourage exploration
