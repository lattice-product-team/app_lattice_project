## ADDED Requirements

### Requirement: One-Shot Recenter Behavior
The "Recenter" button SHALL trigger a single-shot camera move to the user's current coordinates without activating persistent location tracking.

#### Scenario: Pressing Recenter button
- **WHEN** the user is in `FREE` camera mode and presses the Recenter button
- **THEN** the camera SHALL perform a smooth animated move to center on the user's current location and remain in `FREE` mode.

### Requirement: Recenter State Integration
The Recenter button SHALL NOT be available or SHALL be visually disabled when the camera is already in `NAVIGATION` or `FOLLOW` mode, as the system is already handling centering.

#### Scenario: Active Navigation
- **WHEN** the camera is in `NAVIGATION` mode
- **THEN** the Recenter button MUST be hidden or disabled to avoid user confusion.
