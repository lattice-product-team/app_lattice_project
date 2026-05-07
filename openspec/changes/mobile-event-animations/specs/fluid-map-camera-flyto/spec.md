## ADDED Requirements

### Requirement: Apple Maps Style Camera Fly-To

The system SHALL animate the map camera to the target coordinates when an event or POI is selected, using a smooth, interpolated "fly-to" motion rather than an instant jump or a linear pan.

#### Scenario: Selection Camera Transition

- **WHEN** the user selects an event from any UI source
- **THEN** the map camera MUST execute a "fly-to" animation adjusting center, zoom, and potentially pitch to optimally frame the selection.

### Requirement: Offset Camera Centering

The system SHALL NOT center the target coordinate exactly in the middle of the screen. Instead, it MUST apply a padding or offset so the selected location is visibly positioned in the upper portion of the screen, avoiding overlap with the bottom sheet interface.

#### Scenario: Framing Above Sheet

- **WHEN** the map camera flies to a selected event
- **THEN** the final camera position MUST account for bottom padding, placing the pin in the visible area above the bottom sheet.
