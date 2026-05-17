## ADDED Requirements

### Requirement: User Gesture Overrides All Locks
The system MUST prioritize user touch input over any active camera tracking or programmatic locking. Any manual movement of the map MUST irrevocably set the camera mode to `FREE`.

#### Scenario: Breaking Follow Mode
- **WHEN** the camera is in a tracking mode (Follow, FollowWithHeading)
- **AND** the user performs a pan gesture on the map surface
- **THEN** the system MUST immediately switch to `FREE` mode and stop all automated tracking.

### Requirement: Native-to-React Synchronization
The application SHALL update its internal camera state based on events emitted by the native map engine to ensure visual consistency.

#### Scenario: Hardware-level tracking break
- **WHEN** the native MapLibre engine detects a gesture and internally cancels tracking
- **THEN** the React state store MUST be updated to reflect the new `FREE` camera mode immediately.
