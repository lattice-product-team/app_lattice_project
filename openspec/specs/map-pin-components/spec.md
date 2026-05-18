# map-pin-components Specification

## Purpose

This spec defines the visual presentation and behavior of map markers/pins.

## Requirements

### Requirement: Event Pin Visuals (Apple Style)

The system SHALL display Event pins using high-performance GPU layers (`CircleLayer` and `SymbolLayer`). The pin MUST include a white background circle and a dynamic border color based on the category. The event title MUST be rendered as a native `SymbolLayer` label with a white halo for legibility.

#### Scenario: Normal Display

- **WHEN** the map renders an event pin in its default state
- **THEN** it shows a white GPU circle with a 2px colored border and a native text label with `textHaloColor: '#FFFFFF'` and `textHaloWidth: 2`
- **AND** it SHALL remain hidden until its world-to-screen projection is synchronized to prevent (0,0) coordinate flashes

### Requirement: POI Pin Visuals (Minimalist)

The system SHALL display sub-POIs as minimalist category-based SDF glyphs rendered via the map's native GPU layers (`SymbolLayer`) for maximum stability and dynamic coloring.

#### Scenario: Display by Category

- **WHEN** a sub-POI is rendered
- **THEN** it shows the official Lattice category SDF glyph in a 24x24px area, tinted with the category's primary color
- **AND** it MUST NOT exhibit any positional jumping or "flash" on mount

### Requirement: 3D Billboarding

The system SHALL ensure that all map markers remain vertical and facing the camera regardless of the map's pitch (tilt).

#### Scenario: Map Tilt

- **WHEN** the user tilts the map in 3D mode
- **THEN** all GPU pins MUST use `iconPitchAlignment: 'viewport'` or equivalent to remain perpendicular to the screen plane.
