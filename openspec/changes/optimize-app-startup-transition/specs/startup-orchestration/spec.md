## ADDED Requirements

### Requirement: Parallel Startup Orchestration

The system SHALL initiate navigation to the primary app routes immediately after font loading is complete, allowing data pre-fetching and native map initialization to occur in parallel.

#### Scenario: Simultaneous loading

- **WHEN** fonts are loaded
- **THEN** the system SHALL redirect to the `(main)` index route and start fetching events while the map engine starts initializing its native layers.

### Requirement: Unified Readiness Handshake

The system SHALL maintain the `AppSplashScreen` global visibility until both the critical data pre-fetch is successful and the native map engine has finished its initial style rendering.

#### Scenario: Waiting for all components

- **WHEN** data is successfully fetched but the map engine is still initializing
- **THEN** the `AppSplashScreen` MUST remain visible at 100% opacity.

### Requirement: Smooth Startup Transition

The system SHALL desvanece (fade out) the `AppSplashScreen` over a period of 600-800ms once all readiness conditions are met.

#### Scenario: Fluid reveal

- **WHEN** data is ready and the map is initialized
- **THEN** the `AppSplashScreen` opacity SHALL animate from 1 to 0 smoothly, revealing the fully rendered map.
