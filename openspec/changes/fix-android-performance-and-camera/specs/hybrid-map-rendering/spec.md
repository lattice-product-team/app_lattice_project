## MODIFIED Requirements

### Requirement: Selective MarkerView Injection

The map system SHALL only render custom React Native `MarkerView` or `PointAnnotation` components for the currently selected POI. All events and non-selected POIs MUST be rendered using the GL engine (SymbolLayer/CircleLayer) to ensure UI thread availability on Android and prevent "stuck" camera states caused by main thread saturation.

#### Scenario: Multiple events in view

- **WHEN** multiple events are present in the viewport
- **THEN** all events SHALL be rendered as high-performance GL layers
- **THEN** only the selected event or POI SHALL be promoted to a native React Native view if complex interaction is required

### Requirement: Throttled Viewport State Synchronization

The map system SHALL synchronize its internal zoom and region state to React state using a throttled mechanism (min 100ms) and SHALL NOT trigger full-component re-renders for incremental viewport changes unless crossing a significant zoom threshold.

#### Scenario: Continuous panning on Android

- **WHEN** the user pans the map continuously on an Android device
- **THEN** React state updates MUST NOT exceed 10 per second
- **THEN** the map background and GL layers MUST remain fluid at 60fps
