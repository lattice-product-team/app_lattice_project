# map-pin-components Specification

## Purpose

This spec defines the visual presentation and behavior of map markers/pins.

## Requirements

### Requirement: Event Pin Visuals (Apple Style)

The system SHALL display Event pins using high-performance GPU layers (CircleLayer and SymbolLayer). The pin MUST include a white background circle and a dynamic border color based on the category, ensuring positional stability during camera transitions.

#### Scenario: Normal Display

- **WHEN** the map renders an event pin in its default state
- **THEN** it shows a white GPU circle with a 2px colored border and the registered event image as a symbol on top
- **AND** it SHALL remain hidden until its world-to-screen projection is synchronized to prevent (0,0) coordinate flashes

#### Scenario: Selected State

- **WHEN** an event pin is selected
- **THEN** the pin SHALL increase in scale and its `zIndex` MUST be elevated above other map layers.

### Requirement: POI Pin Visuals (Minimalist)

The system SHALL display sub-POIs as minimalist category-based glyphs rendered via the map's native GPU layers (SymbolLayer) for maximum stability.

#### Scenario: Display by Category

- **WHEN** a sub-POI is rendered
- **THEN** it shows the official Lattice category glyph (e.g., bathroom icon, food icon) in a 24x24px area
- **AND** it MUST NOT exhibit any positional jumping or "flash" on mount

### Requirement: 3D Billboarding

The system SHALL ensure that all map markers remain vertical and facing the camera regardless of the map's pitch (tilt).

#### Scenario: Map Tilt

- **WHEN** the user tilts the map in 3D mode
- **THEN** all GPU pins MUST use `iconPitchAlignment: 'viewport'` or equivalent to remain perpendicular to the screen plane.
