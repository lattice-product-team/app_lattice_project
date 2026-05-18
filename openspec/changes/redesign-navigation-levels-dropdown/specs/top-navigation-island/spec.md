## ADDED Requirements

### Requirement: Downward Gesture Control

The system SHALL implement a gesture-driven expansion system that responds to downward drags to expand the discovery interface.

#### Scenario: Expanding to Level 2

- **WHEN** the user drags the top Island downwards from its compact state (Level 1)
- **THEN** the system SHALL animate the expansion towards the medium snap point (Level 2) with a spring effect.

#### Scenario: Collapsing to Level 1

- **WHEN** the user drags the expanded Island upwards towards the top of the screen
- **THEN** the system SHALL collapse the interface back to the compact state (Level 1).

### Requirement: Top-Down Level Snapping

The system SHALL support three distinct snap points (Level 1, 2, 3) oriented from the top of the screen.

#### Scenario: Level 1 (Compact)

- **WHEN** the system is in Level 1
- **THEN** the Island MUST be positioned at the top with a fixed height of approximately 60px.

#### Scenario: Level 2 (Medium)

- **WHEN** the system is in Level 2
- **THEN** the Island MUST expand downwards to cover approximately 50% of the screen height.

#### Scenario: Level 3 (Full)

- **WHEN** the system is in Level 3
- **THEN** the Island MUST expand downwards to cover approximately 80-90% of the screen height.
