## ADDED Requirements

### Requirement: Throttled Logical Location Updates

The system SHALL only trigger heavy logical operations (such as route recalculation or data fetching) when the user has moved more than a defined distance threshold (e.g., 5-10 meters).

#### Scenario: Distance-Based Recalculation

- **WHEN** the user moves 2 meters
- **THEN** the logical state (e.g., `lastLogicalCoords`) MUST NOT update, preventing a route recalculation.

### Requirement: Decoupled Visual Tracking

Visual location markers (like the user position on the map) SHALL update at high frequency (native 60fps) independently of the React render cycle for logical state.

#### Scenario: Smooth Map Tracking

- **WHEN** the user is moving
- **THEN** the map's user location indicator MUST move smoothly without triggering a React re-render of the parent `MapContent` component.
