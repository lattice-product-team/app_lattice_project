## MODIFIED Requirements

### Requirement: Event Pin Visuals (Apple Style)

The system SHALL display Event pins using custom React Native components within a `MarkerView`. The pin MUST include a circular body with an image or placeholder, a distinct border, and a bottom-anchored label.

#### Scenario: Normal Display

- **WHEN** the map renders an event pin
- **THEN** it shows a circular pin with a white background, a category-colored border, and the event image
- **AND** it MUST be clipped to a perfect circle regardless of the source image aspect ratio

#### Scenario: Selected State

- **WHEN** an event pin is selected
- **THEN** the pin SHALL increase in scale (1.2x) and its `zIndex` MUST be elevated to 999.

### Requirement: POI Pin Visuals (Minimalist)

The system SHALL display POIs as minimalist category-based glyphs using the same `MarkerView` architecture as events.

#### Scenario: Display by Category

- **WHEN** a POI is rendered
- **THEN** it shows the official Lattice category glyph in a styled circular background
- **AND** it MUST remain perfectly anchored to its coordinate during map rotation

### Requirement: 3D Billboarding

The system SHALL ensure that all map markers remain vertical and facing the camera regardless of the map's pitch (tilt).

#### Scenario: Map Tilt

- **WHEN** the user tilts the map in 3D mode
- **THEN** all `MarkerView` instances MUST remain perpendicular to the screen plane
- **AND** their `anchor` point MUST be calibrated to prevent visual "lifting" from the ground plane

## ADDED Requirements

### Requirement: Standardized Anchor Calibration

The system SHALL use a standardized anchor point (typically bottom-center or center-center) for all `MarkerView` components to ensure they remain pinned to their geographic coordinate during camera rotation and tilt.

#### Scenario: Map Rotation

- **WHEN** the user rotates the map view
- **THEN** the base of the marker MUST remain exactly on its geographic coordinate without any orbital displacement.
