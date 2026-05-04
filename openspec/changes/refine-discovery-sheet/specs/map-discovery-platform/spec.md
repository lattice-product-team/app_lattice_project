## MODIFIED Requirements

### Requirement: Unified Discovery & Detail Transition
The system SHALL allow seamless transitions between general event discovery, specific POI details, and a global search experience within the same unified bottom sheet architecture. When in Level 3 (Full Screen) without a selected POI, the system MUST prioritize the Search Experience over legacy placeholders.

#### Scenario: Level 3 Dynamic Content
- **WHEN** the sheet reaches Level 3 (islandState > 0.8) and no POI is selected
- **THEN** it MUST display the Search Experience (Recent Searches and Available Events) instead of a "Select point" placeholder.
