## MODIFIED Requirements

### Requirement: Permanent Island UI

The system SHALL display the map discovery interface as a detached floating card (Island) that is pinned to the top of the screen. It MUST maintain a minimum horizontal margin of 16px and a top margin of at least 10px (plus safe area) across all snap points.

#### Scenario: Visualizing the Compact State
- **WHEN** the sheet is in the lowest snap point (Level 1)
- **THEN** it MUST appear as a rounded floating capsule at the top of the screen.
- **THEN** it MUST maintain a visible gap between its top edge and the status bar area.

#### Scenario: Visualizing the Full State
- **WHEN** the sheet is in its maximum expansion snap point (Level 3)
- **THEN** it MUST expand downwards, maintaining a visible gap at both the top and bottom of the screen, preserving the "card" aesthetic.

### Requirement: Glassmorphic Visual Tokens

All discovery UI elements MUST adhere to the "Midnight Glass" design tokens. The Island MUST have a 32px corner radius on the bottom corners when partially expanded, and on all corners when fully floating. It MUST include a 0.5px inner glow border.

#### Scenario: Visual Consistency
- **WHEN** any part of the discovery interface is rendered
- **THEN** it MUST have a blur intensity of 90 and a semi-transparent tint that matches the system theme.
- **THEN** the corner radius MUST be applied to the bottom edges to reflect the top-down orientation.
