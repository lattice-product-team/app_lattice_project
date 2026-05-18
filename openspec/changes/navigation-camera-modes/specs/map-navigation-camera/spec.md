## ADDED Requirements

### Requirement: Planning Focus Transition

The system SHALL perform a smooth cinematic fly-to transition to the user's current location when a route planning session is initiated.

#### Scenario: Entering planning mode

- **WHEN** user selects a destination and triggers directions
- **THEN** system performs a fly-to animation to the user's current coordinates at a zoom level of 16.

### Requirement: Programmatic Move Protection

The system SHALL ignore manual map gestures while a programmatic camera movement (e.g., initial fly-to, route fitting, or recentering) is active.

#### Scenario: Map gesture during fly-to

- **WHEN** a programmatic camera animation is in progress AND the user attempts a drag gesture
- **THEN** system SHALL NOT decouple the camera tracking until the animation completes.
