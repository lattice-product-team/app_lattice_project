## ADDED Requirements

### Requirement: Real-time Performance Monitoring

The system SHALL provide a mechanism to monitor the frame rate (FPS) and JS thread health on Android devices during development to identify bottlenecks.

#### Scenario: Displaying performance stats

- **WHEN** the app is in development mode
- **AND** the performance overlay is enabled via the debug menu
- **THEN** the system MUST display a persistent overlay showing current UI FPS, JS FPS, and memory usage.

### Requirement: Frame Drop Logging

The system SHALL detect and log significant frame drops during transitions on Android.

#### Scenario: Significant lag detected

- **WHEN** a Reanimated transition (e.g., sheet expansion) drops more than 5 consecutive frames
- **THEN** the system MUST log a performance warning to the console including the name of the active animation.
