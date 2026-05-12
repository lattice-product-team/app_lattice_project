## MODIFIED Requirements

### Requirement: Zoom-based Discovery

The system SHALL automatically reveal associated sub-POIs as the user zooms into an event's geographic area. To prevent clutter, labels MUST be hidden at lower zoom levels and only revealed at high zoom (> 17) or upon selection.

#### Scenario: Approaching Zoom

- **WHEN** the map zoom level exceeds 16.5
- **THEN** sub-POIs in the current viewport SHALL become visible using a smooth opacity transition
- **AND** their text labels SHALL remain hidden until zoom level 17 is reached.

### Requirement: Hierarchical Visibility

The system SHALL manage sub-POI visibility and spatial arrangement to prevent overlapping.

#### Scenario: Selection Reveal

- **WHEN** an Event is selected
- **THEN** the system SHALL reveal all sub-POIs associated with that Event regardless of zoom level
- **AND** apply spiderfication (offset) if multiple POIs are at the same coordinate.
