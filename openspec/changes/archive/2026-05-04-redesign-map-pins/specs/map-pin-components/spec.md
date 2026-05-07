## ADDED Requirements

### Requirement: Event Pin Visuals (Apple Style)

The system SHALL display Event pins as high-fidelity circular markers containing an image of the event. The pin MUST include a white border and a drop shadow.

#### Scenario: Normal Display

- **WHEN** the map renders an event pin in its default state
- **THEN** it shows a 44x44px circular image with a 2px white border and a label below

#### Scenario: Selected State

- **WHEN** an event pin is selected
- **THEN** the pin SHALL grow in size (e.g., 60x60px) and display a "pin tail" pointing to its exact coordinate

### Requirement: POI Pin Visuals (Minimalist)

The system SHALL display sub-POIs as minimalist category-based glyphs without complex backgrounds.

#### Scenario: Display by Category

- **WHEN** a sub-POI is rendered
- **THEN** it shows the official Lattice category glyph (e.g., bathroom icon, food icon) in a 24x24px area

### Requirement: 3D Billboarding

The system SHALL ensure that all map markers remain vertical and facing the camera regardless of the map's pitch (tilt).

#### Scenario: Map Tilt

- **WHEN** the user tilts the map in 3D mode
- **THEN** the pins MUST NOT tilt with the ground but remain perpendicular to the screen plane
