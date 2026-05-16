## ADDED Requirements

### Requirement: 4-State Tracking Cycle

The recenter button SHALL cycle through the available map tracking modes in a specific sequence.

- **Sequence**: None (Free) -> Follow (Normal) -> Compass (Heading) -> Course (Course) -> None.
- **Visuals**: The button icon MUST update to reflect the current active tracking mode.
- **Persistence**: The selected tracking mode SHALL be preserved across minor UI state changes unless explicitly broken by user interaction.

#### Scenario: Cycling through modes
- **WHEN** the user taps the recenter button multiple times
- **THEN** the system SHALL increment the `UserTrackingMode` state through the defined 4-state cycle.
