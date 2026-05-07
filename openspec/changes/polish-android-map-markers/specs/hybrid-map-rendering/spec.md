## MODIFIED Requirements

### Requirement: Unified MarkerView Architecture
The map system SHALL render all dynamic entities (POIs and Events) using custom React Native `MarkerView` components. The system MUST NOT use `SymbolLayer` or `CircleLayer` for these elements to ensure consistent visual quality and styling capabilities.

#### Scenario: Global marker rendering
- **WHEN** the map loads or updates its data
- **THEN** all POIs and Events SHALL be rendered as `MarkerView` instances
- **AND** they MUST maintain perfect synchronization with the underlying map engine via the throttled viewport state

### Requirement: Throttled Viewport State Synchronization
The map system SHALL synchronize its internal zoom and region state to React state using a throttled mechanism (min 100ms) to ensure UI reactivity without blocking the main thread.

#### Scenario: Zoom gesture
- **WHEN** the user performs a pinch-to-zoom gesture
- **THEN** the map markers SHALL update their visibility and level-of-detail state based on the throttled zoom value

## REMOVED Requirements

### Requirement: Selective MarkerView Injection
**Reason**: Replaced by Unified MarkerView Architecture for consistency.
**Migration**: Use the new unified `MarkerView` system for all dynamic map elements.

### Requirement: GL-Based POI Rendering
**Reason**: Replaced by Unified MarkerView Architecture to provide higher fidelity and easier styling.
**Migration**: Transition all POI rendering logic from `SymbolLayer` to `MarkerView`.
