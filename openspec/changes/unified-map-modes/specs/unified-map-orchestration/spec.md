## ADDED Requirements

### Requirement: Unified App Mode Machine

The system SHALL maintain a single, authoritative source of truth for the application's active mode, encompassing both UI visibility and camera behavior.

- **Modes**: `EXPLORING`, `POI_DETAIL`, `PLANNING`, `NAVIGATING`, `SAVED_LIST`, `AR_EXPLORE`.
- **Transitions**: The system MUST handle cleanup of conflicting states (e.g., clearing POI selection when starting navigation) as part of the mode transition.

#### Scenario: Switching from POI Detail to Navigation

- **WHEN** user starts navigation from a selected POI
- **THEN** the system SHALL transition to `NAVIGATING` mode, clear the active POI selection, and hide the Discovery Dashboard.

### Requirement: Centralized Camera Transition Manager

The system SHALL use a single manager to orchestrate all map camera movements and transitions, preventing multiple effects from controlling the camera simultaneously.

- **Resilience**: The system MUST execute a synchronous "Safety Reset" (clearing all paddings and goals) before initiating any programmatic camera animation.
- **Throttle**: Camera updates based on mode changes MUST be throttled or debounced to prevent visual jitter.

#### Scenario: Centering camera on User in Navigation

- **WHEN** user triggers "Recenter" during active navigation
- **THEN** the system SHALL first reset native camera goals and then execute a smooth `flyTo` animation to the user's current location with a 45-degree pitch.

### Requirement: Syncronized UI Layer Visibility

The system SHALL derive the visibility of all HUD elements, overlays, and bottom sheets from the active App Mode.

#### Scenario: Hiding HUD during AR Explore

- **WHEN** the system enters `AR_EXPLORE` mode
- **THEN** the system SHALL immediately hide the Map HUD, Centering Button, and Discovery Island.
