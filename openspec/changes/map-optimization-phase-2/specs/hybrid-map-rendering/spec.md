## ADDED Requirements

### Requirement: Selective MarkerView Injection
The map system SHALL only render custom React Native `MarkerView` components for the currently selected POI and primary events. All other POIs MUST be rendered using the GL engine for performance.

#### Scenario: Selection state transition
- **WHEN** a user selects a POI rendered in the GL `SymbolLayer`
- **THEN** the system SHALL immediately hide the GL icon for that POI and mount a `MarkerView` component at the same coordinate

### Requirement: GL-Based POI Rendering
The map system SHALL render non-active POIs using a `SymbolLayer` to ensure zero-latency positioning during map gestures.

#### Scenario: Fast panning
- **WHEN** the user pans the map rapidly
- **THEN** all non-active POIs MUST remain perfectly synchronized with the map background without any positioning delay or (0,0) flashes

### Requirement: Throttled Viewport State Synchronization
The map system SHALL synchronize its internal zoom and region state to React state using a throttled mechanism (min 100ms) to ensure UI reactivity without blocking the main thread.

#### Scenario: Zoom gesture
- **WHEN** the user performs a pinch-to-zoom gesture
- **THEN** the map markers SHALL update their visibility and level-of-detail state based on the throttled zoom value
