## MODIFIED Requirements

### Requirement: Navigation Camera Behavior
During active navigation, the map camera SHALL automatically follow the user's location using the system's unified mode orchestrator.

- **Mode**: "Course" tracking (map rotates based on user heading) on iOS, and "Compass" tracking on Android.
- **Pitch**: 45 degrees for a 3D perspective view.
- **Resilience**: The follow-user logic MUST be disabled and the camera "unlocked" immediately if the user interacts manually with the map.

#### Scenario: User interaction during navigation
- **WHEN** user drags the map during active navigation
- **THEN** the system SHALL immediately transition the camera mode to `FREE` while keeping the navigation UI active.
