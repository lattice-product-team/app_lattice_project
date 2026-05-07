## MODIFIED Requirements

### Requirement: POI Pin Visuals (Minimalist)

The system SHALL display sub-POIs as minimalist category-based glyphs rendered via the map's native GPU layers (SymbolLayer) for maximum stability.

#### Scenario: Display by Category

- **WHEN** a sub-POI is rendered
- **THEN** it shows the official Lattice category glyph (e.g., bathroom icon, food icon) in a 24x24px area
- **AND** it MUST NOT exhibit any positional jumping or "flash" on mount

### Requirement: Event Pin Visuals (Apple Style)

The system SHALL display Event pins as high-fidelity circular markers containing an image of the event, ensuring positional stability during camera transitions.

#### Scenario: Normal Display

- **WHEN** the map renders an event pin in its default state
- **THEN** it shows a 44x44px circular image with a 2px white border and a label below
- **AND** it SHALL remain hidden until its world-to-screen projection is synchronized to prevent (0,0) coordinate flashes
