## MODIFIED Requirements

### Requirement: Event Pin Visuals (Apple Style)

The system SHALL display Event pins using high-performance GPU layers (CircleLayer and SymbolLayer). The pin MUST include a white background circle and a dynamic border color based on the category.

#### Scenario: Normal Display

- **WHEN** the map renders an event pin in its default state
- **THEN** it shows a white GPU circle with a 2px colored border and the registered event image as a symbol on top.

#### Scenario: Selected State

- **WHEN** an event pin is selected
- **THEN** the pin SHALL increase in scale and its `zIndex` MUST be elevated above other map layers.

### Requirement: 3D Billboarding

The system SHALL ensure that all map markers remain vertical and facing the screen regardless of the map's pitch (tilt).

#### Scenario: Map Tilt

- **WHEN** the user tilts the map in 3D mode
- **THEN** all GPU pins MUST use `iconPitchAlignment: 'viewport'` or equivalent to remain perpendicular to the screen plane.
