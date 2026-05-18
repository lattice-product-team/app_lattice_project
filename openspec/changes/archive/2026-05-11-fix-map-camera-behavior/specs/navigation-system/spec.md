## MODIFIED Requirements

### Requirement: Navigation Camera Behavior

During active navigation, the map camera SHALL automatically follow the user's location using the `NAVIGATION` lifecycle state.

- **Mode**: "Course" tracking (map rotates based on user heading).
- **Pitch**: 45 degrees for a 3D perspective view.
- **Priority**: This mode SHALL override any `FOLLOW` or `FREE` camera states until navigation is ended or the user manually intervenes.

#### Scenario: Starting active navigation

- **WHEN** user taps "Go" on a selected route
- **THEN** system SHALL set camera state to `NAVIGATION` and center the camera on the user's location with the defined pitch and rotation.
