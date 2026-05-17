## MODIFIED Requirements

### Requirement: Selective MarkerView Injection
The map system SHALL only render custom React Native `PointAnnotation` components for the currently selected POI or Event. ALL other POIs and Events MUST be rendered using the native GL engine (SymbolLayer/CircleLayer) for maximum performance.

#### Scenario: Selection state transition
- **WHEN** a user selects a POI rendered in the GL `SymbolLayer`
- **THEN** the system SHALL immediately hide the GL icon for that POI (via layer filter) and mount a single React Native `PointAnnotation` component at the same coordinate
- **AND** it SHALL unmount any previous selection's `PointAnnotation`

### Requirement: GL-Based POI Rendering
The map system SHALL render all non-active POIs and Events using native MapLibre layers to ensure zero-latency positioning during map gestures.

#### Scenario: Fast panning
- **WHEN** the user pans the map rapidly
- **THEN** all non-active markers MUST remain perfectly synchronized with the map background without any positioning delay or (0,0) flashes
