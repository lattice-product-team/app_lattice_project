## ADDED Requirements

### Requirement: Unified POI Marker Rendering

The system SHALL render Points of Interest (POIs) using a component-based `POIMarker` within a `MarkerView` instead of GL layers when the zoom level is above 16.0.

#### Scenario: POI rendering on zoom

- **WHEN** the map zoom level increases beyond 16.0
- **THEN** POI icons SHALL transition from simple GL circles to full `POIMarker` pills with category icons.

### Requirement: Category-specific POI Aesthetics

Each `POIMarker` SHALL display a category icon from the local asset library and use a background color corresponding to its category metadata.

#### Scenario: Visual differentiation by category

- **WHEN** a POI of category "restaurant" is rendered
- **THEN** it SHALL display the `restaurant.png` icon on a colored background (e.g., orange).

### Requirement: Smooth POI Selection Animation

The `POIMarker` SHALL implement a linear scaling and translation animation when selected, following the visual behavior of the `EventMarker`.

#### Scenario: POI selection animation

- **WHEN** a user taps on a `POIMarker`
- **THEN** the marker SHALL scale to 1.3 and translate -10px upwards over 250ms without bouncing.
