## ADDED Requirements

### Requirement: Real-time zoom reactivity

The map system SHALL update the reactive zoom level state continuously during camera movement (dragging, pinching, or programmatic movement) to ensure hierarchical pins are filtered without lag.

#### Scenario: Zooming in for POI reveal

- **WHEN** the user is pinching the map to zoom in from level 15 to 17
- **THEN** the POI pins MUST begin to appear as soon as the zoom threshold (e.g., 16.0) is crossed during the gesture, not just after the gesture ends.

### Requirement: Throttled state synchronization

The system SHALL throttle the frequency of React state updates during continuous map movement to maintain 60fps performance while ensuring visual reactivity.

#### Scenario: Dragging performance

- **WHEN** the user is dragging the map rapidly
- **THEN** the system MUST update the zoom state at a frequency that balances UI responsiveness with rendering performance (e.g., every 50-100ms).

### Requirement: Stable marker initialization

The custom map markers (MarkerViews) SHALL NOT be visible to the user until their correct geographic position has been calculated and applied by the map engine.

#### Scenario: Marker mount stability

- **WHEN** a new pin component is mounted on the map
- **THEN** it MUST remain invisible (opacity 0) for a brief synchronization period (e.g., 50ms) before animating into view at its correct location.

### Requirement: Coordinate integrity

The system SHALL prevent the rendering of map markers if their coordinates are invalid or represent the default [0, 0] location.

#### Scenario: Invalid coordinate suppression

- **WHEN** an event or POI has coordinates [0, 0] or null
- **THEN** the corresponding map marker MUST NOT be rendered.
