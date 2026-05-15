## MODIFIED Requirements

### Requirement: Navigation Camera Behavior
During active navigation, the map camera SHALL automatically follow the user's location and heading, with platform-specific adjustments for reliability.

- **Mode**: "Course/Compass" tracking (map rotates based on user heading).
- **Pitch**: The camera SHALL use a 45-degree pitch by default to provide a 3D perspective view.
- **Android Specifics**: The system MUST distinguish between programmatic camera updates (navigation) and manual user interaction to prevent accidental deactivation of follow mode.
- **Auto-Heading**: On Android, the system SHALL ensure the map rotates according to the device's compass or motion vector when navigation is active.

#### Scenario: Entering Navigation View
- **WHEN** user starts active navigation on Android
- **THEN** the camera SHALL smoothly transition to the user's location, apply a 45-degree pitch, and rotate the map to align with the user's heading.

#### Scenario: Manual Interaction during Navigation
- **WHEN** user manually pans the map during active navigation
- **THEN** the system SHALL immediately switch to "FREE" camera mode and provide a clear "Centrar" (Recenter) button to resume tracking.
