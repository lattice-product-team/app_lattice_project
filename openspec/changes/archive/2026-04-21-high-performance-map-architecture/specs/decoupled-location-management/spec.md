## MODIFIED Requirements

### Requirement: Decoupled Visual Tracking
Visual location markers (like the user position on the map) SHALL update at high frequency (native 60fps) independently of the React render cycle for logical state.

#### Scenario: Smooth Map Tracking
- **WHEN** the user is moving
- **THEN** the map's user location indicator MUST move smoothly without triggering a React re-render of the parent `MapContent` component.

#### Scenario: Camera-Location Sync
- **WHEN** `followUserLocation` is active
- **THEN** the camera SHALL synchronize with the high-frequency native location updates without saturated JS bridge callbacks.
