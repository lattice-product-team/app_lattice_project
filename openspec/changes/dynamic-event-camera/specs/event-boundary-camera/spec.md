## ADDED Requirements

### Requirement: Standard Gold Zoom (17.2)

The system SHALL use a standardized zoom level of 17.2 when focusing on an event to ensure optimal balance between context and legibility.

#### Scenario: Selection of any event

- **WHEN** an event is selected (via map or list)
- **THEN** the camera MUST fly to zoom level 17.2
- **AND** MUST center on the event's centroid or primary coordinate.

### Requirement: Enhanced Label Legibility

POI labels SHALL be fully rendered and prioritized when the camera is at the Standard Gold Zoom level.

#### Scenario: Label rendering at zoom 17.2

- **WHEN** the map zoom is at 17.2
- **THEN** all POI labels associated with the active event MUST be rendered with 100% opacity.
- **AND** SHOULD ignore placement collisions to ensure they remain visible.

## MODIFIED Requirements

### Requirement: Map Label Visibility Thresholds

(Modified from original map-layers-spec)
The system SHALL lower the visibility thresholds for POI labels to support the Standard Gold Zoom.

#### Scenario: Progressive label fade-in

- **WHEN** zoom level reaches 16.0
- **THEN** labels MUST begin to render
- **AND** MUST reach 100% opacity at zoom level 17.0.
