## MODIFIED Requirements

### Requirement: Event Pin Visuals (Apple Style)

The system SHALL display Event pins using high-performance GPU layers (CircleLayer and SymbolLayer) OR via synchronized `MarkerView` components when interactive React features are required. The pin MUST include a white background circle and a dynamic border color based on the category, ensuring positional stability during camera transitions.

#### Scenario: Normal Display

- **WHEN** the map renders an event pin in its default state
- **THEN** it shows a white circle with a 2px colored border and the registered event image as a symbol on top
- **AND** it SHALL remain hidden until its world-to-screen projection is synchronized to prevent (0,0) coordinate flashes.

#### Scenario: Selected State

- **WHEN** an event pin is selected
- **THEN** the pin SHALL increase in scale and its `zIndex` MUST be elevated above other map layers (suggested `zIndex: 500`).

### Requirement: POI Pin Visuals (Minimalist)

The system SHALL display sub-POIs as minimalist category-based glyphs. At high zoom levels, these MAY include text labels; at low zoom levels, labels MUST be suppressed to avoid overlap.

#### Scenario: Display by Category

- **WHEN** a sub-POI is rendered
- **THEN** it shows the official Lattice category glyph (e.g., bathroom icon, food icon) in a 24x24px area
- **AND** it MUST NOT exhibit any positional jumping or "flash" on mount
- **AND** its `zIndex` SHALL be lower than Event pins (suggested `zIndex: 100`).
