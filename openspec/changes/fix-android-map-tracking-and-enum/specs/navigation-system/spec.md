## MODIFIED Requirements

### Requirement: Navigation Camera Behavior

During active navigation, the map camera SHALL automatically follow the user's location using native tracking modes.

- **Tracking Mode**: The system MUST utilize the native `UserTrackingMode` (None, Follow, Compass, Course).
- **Course Tracking**: Active navigation MUST use "Course" tracking mode (map rotates based on user heading).
- **Pitch**: 45 degrees for a 3D perspective view.
- **Stability**: The camera SHALL maintain the current map center when transitioning out of tracking modes (e.g., manual pan) or when resetting UI margins (e.g., deselection).

#### Scenario: Maintaining position on deselection
- **WHEN** the user deselects a point of interest
- **THEN** the system SHALL reset the map padding WITHOUT re-centering the camera on the previous target.

#### Scenario: Transitioning tracking modes
- **WHEN** the user manually pans the map during active tracking
- **THEN** the system SHALL switch the `UserTrackingMode` to `None` and maintain the camera's current position.
