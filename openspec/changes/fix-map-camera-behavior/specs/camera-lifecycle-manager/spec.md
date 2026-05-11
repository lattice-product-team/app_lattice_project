## ADDED Requirements

### Requirement: Centralized Camera Mode Management
The system SHALL maintain a single source of truth for the active camera mode, preventing multiple services from attempting to control the camera simultaneously.

#### Scenario: Switching to Navigation Mode
- **WHEN** the user starts active navigation
- **THEN** the system SHALL set the camera mode to `NAVIGATION` and ignore all other `setCamera` requests from non-navigation services.

### Requirement: Camera Mode Hierarchy
The system MUST prioritize camera control requests based on a defined hierarchy: `NAVIGATION` (High) > `FOLLOW` (Medium) > `FREE` (Low).

#### Scenario: User intervention during Follow
- **WHEN** the user manually pans the map while in `FOLLOW` mode
- **THEN** the system SHALL transition the camera mode to `FREE` to prevent the camera from snapping back immediately.

### Requirement: Smooth Transition Interpolation
All camera movements between points of interest or modes SHALL use standardized easing functions to ensure a premium, fluid experience.

#### Scenario: Centering on a POI
- **WHEN** a POI is selected from the search results
- **THEN** the camera MUST glide smoothly to the coordinates using a duration relative to the distance, but not exceeding 1200ms.
