## MODIFIED Requirements

### Requirement: Throttled Viewport State Synchronization

The map system SHALL synchronize its internal zoom and region state to the unified global state using a throttled mechanism (min 150ms) to ensure UI reactivity without blocking the main thread.

- **Gesture Lock**: The system SHALL NOT trigger discrete zoom updates or re-renders of map markers while a user gesture is active (e.g., panning or pinching) on Android.
- **Completion Sync**: The global `lastCameraPosition` MUST only be updated once the camera has fully settled after a programmatic or manual move.

#### Scenario: Smooth panning on Android

- **WHEN** user pans the map on an Android device
- **THEN** the system SHALL defer updating the discrete zoom level until the pan gesture has ended and the camera is stationary.
