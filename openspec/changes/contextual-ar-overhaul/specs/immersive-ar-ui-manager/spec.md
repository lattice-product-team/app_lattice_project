## ADDED Requirements

### Requirement: Full-Screen AR Immersion
The system SHALL hide non-essential navigation and discovery UI elements when the AR overlay is active to provide an unobstructed view.

#### Scenario: AR Activation
- **WHEN** the AR system becomes visible
- **THEN** the system SHALL fade out the Floating Search Bar and the Mode Toggle (Explore/Map) controls.

#### Scenario: AR Deactivation
- **WHEN** the AR system is closed
- **THEN** the system SHALL fade in the Floating Search Bar and the Mode Toggle controls.

### Requirement: Contextual AR HUD Messaging
The AR Head-Up Display (HUD) SHALL display messages that reflect the current contextual mode.

#### Scenario: Displaying current location context
- **WHEN** the user is inside an event boundary in AR
- **THEN** the HUD SHALL display the name of the active event (e.g., "EXPLORING: SUMMER FEST").

#### Scenario: Displaying global context
- **WHEN** the user is outside boundaries in AR
- **THEN** the HUD SHALL display a global exploration message (e.g., "DISCOVERING EVENTS").
