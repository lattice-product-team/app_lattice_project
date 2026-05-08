## ADDED Requirements

### Requirement: HUD Buttons Fade-Out
The system SHALL fade out the bottom HUD buttons (Left/Right) whenever a bottom sheet is in a Semi-Transparent (ST) or Non-Transparent (NT) state that overlaps their visual area.

#### Scenario: Sheet Overlap
- **WHEN** any bottom sheet is at Level 1 (ST) or Level 2 (NT)
- **THEN** the opacity of the HUD buttons MUST transition to 0
- **THEN** pointerEvents for HUD buttons MUST be set to 'none'

### Requirement: Navigation Mode HUD Hiding
The system SHALL completely hide the Main Dropdown and standard HUD buttons when entering Navigation Mode.

#### Scenario: Entering Navigation
- **WHEN** isNavigating is TRUE
- **THEN** Main Dropdown opacity MUST be 0
- **THEN** Navigation Banner MUST become visible
