# map-pin-components Delta Specification

## MODIFIED Requirements

### Requirement: Event Pin Visuals (Apple Style)
The system SHALL display Event pins using stabilized `MarkerView` components. The pin MUST include a white background bubble frame and a dynamic border color based on the category.

#### Scenario: Normal Display
- **WHEN** the map renders an event pin in its default state
- **THEN** it shows a white bubble frame with a 1.5px colored border and the registered Lucide icon or event image inside
- **AND** it SHALL use a "Layout Shield" wrapper of 120x80px to ensure positional stability and visibility on iOS.

### Requirement: POI Pin Visuals (Minimalist)
The system SHALL display sub-POIs as minimalist category-based Lucide icons rendered via stabilized `MarkerView` components.

#### Scenario: Display by Category
- **WHEN** a sub-POI is rendered
- **THEN** it shows the official Lattice category Lucide icon in a 32x32px bubble frame
- **AND** it MUST use the `map-marker-system` for rendering to ensure platform consistency.
