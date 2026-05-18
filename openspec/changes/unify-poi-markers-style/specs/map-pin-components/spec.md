## MODIFIED Requirements

### Requirement: POI Pin Visuals (Minimalist)

The system SHALL display POIs as minimalist category-based markers rendered via `MarkerView` for maximum visual quality and consistency with Event markers.

#### Scenario: Display by Category

- **WHEN** a POI is rendered
- **THEN** it shows the official Lattice category glyph (e.g., bathroom icon, food icon) within a `MapPinFrame` pill
- **AND** it MUST NOT exhibit any positional jumping or "flash" on mount
- **AND** it SHALL use local PNG assets for the category glyphs.

### Requirement: Event Pin Visuals (Apple Style)

The system SHALL display Event pins using `MarkerView` components to support rich visuals and complex animations. The pin MUST include a `MapPinFrame` with the event image or a placeholder icon, ensuring positional stability during camera transitions.

#### Scenario: Normal Display

- **WHEN** the map renders an event pin in its default state
- **THEN** it shows a white `MapPinFrame` with a 1.5px border and the registered event image inside
- **AND** it SHALL remain hidden until its world-to-screen projection is synchronized to prevent (0,0) coordinate flashes

#### Scenario: Selected State

- **WHEN** an event pin is selected
- **THEN** the pin SHALL increase in scale by 1.3 and translate -10px upwards via a smooth, non-bouncy animation.
