## ADDED Requirements

### Requirement: Permanent Island UI

The system SHALL display the map discovery interface as a detached floating card (Island) that maintains a minimum horizontal margin of 16px and a bottom margin of at least 20px (plus safe area) across all snap points.

#### Scenario: Visualizing the Compact State

- **WHEN** the sheet is in the lowest snap point
- **THEN** it MUST appear as a rounded floating capsule with a visible gap between its bottom edge and the screen bottom.

#### Scenario: Visualizing the Full State

- **WHEN** the sheet is in its maximum expansion snap point
- **THEN** it MUST maintain a visible gap at both the top and bottom of the screen, preserving the "card" aesthetic.

### Requirement: Unified Discovery & Detail Transition

The system SHALL allow seamless transitions between general event discovery and specific POI details within the same unified bottom sheet architecture.

#### Scenario: Opening POI Details

- **WHEN** a user selects a POI from the discovery list
- **THEN** the content MUST update to show POI details without the sheet detaching or resetting its "Island" layout properties.

### Requirement: Glassmorphic Visual Tokens

All discovery UI elements MUST adhere to the "Midnight Glass" design tokens, including a 32px corner radius on all corners and a 0.5px inner glow border.

#### Scenario: Visual Consistency

- **WHEN** any part of the discovery interface is rendered
- **THEN** it MUST have a blur intensity of 90 and a semi-transparent tint that matches the system theme.
