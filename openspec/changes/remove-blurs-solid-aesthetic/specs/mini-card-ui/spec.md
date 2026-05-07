## MODIFIED Requirements

### Requirement: POI Mini-Card Transition
The system SHALL display a compact details card when an individual sub-POI is selected. The mini-card MUST utilize a solid-transparency background that matches the main search bar's visual weight.

#### Scenario: Selection Transition
- **WHEN** a sub-POI is selected
- **THEN** the system SHALL slide down the main Event Sheet and slide up a smaller (max 30% screen height) mini-card with POI details
- **AND** the background MUST be rendered using a solid color with calibrated transparency (0.85 opacity), avoiding all blur effects.
