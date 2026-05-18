## ADDED Requirements

### Requirement: Stable Startup Camera Centering

The system SHALL snap the map camera to the user's location exactly once upon application startup when coordinates become available, and then immediately transition to FREE camera mode. Subsequent GPS location updates SHALL NOT trigger any automated camera snaps or centering behavior while the camera remains in FREE mode.

#### Scenario: Initial Snap on Startup

- **WHEN** the application completes loading and current GPS coordinates are obtained for the first time
- **THEN** the system MUST snap the camera to the user's coordinates and set the tracking mode to FREE.

#### Scenario: Free Panning After Startup

- **WHEN** the camera has snapped to the user's startup coordinates
- **THEN** any subsequent updates to userCoords MUST NOT cause the camera to snap or jump back to the user's location, allowing the user to pan manual camera movements without interference.
