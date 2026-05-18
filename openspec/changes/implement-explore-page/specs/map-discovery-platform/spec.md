## MODIFIED Requirements

### Requirement: Unified Discovery & Detail Transition

The system SHALL allow seamless transitions between general event discovery, specific POI details, and a global search experience within the same unified bottom sheet architecture, with all content dynamically fetched from the spatial database. When in Level 3 (Full Screen) without a selected POI, the system MUST prioritize the Search Experience over legacy placeholders.

#### Scenario: Opening POI Details

- **WHEN** a user selects a POI from the discovery list
- **THEN** the system MUST fetch the latest metadata and geometry from the server to update the view without the sheet detaching or resetting its "Island" layout properties.

#### Scenario: Level 3 Dynamic Content

- **WHEN** the sheet reaches Level 3 (islandState > 0.8) and no POI is selected
- **THEN** it MUST display the Search Experience (Recent Searches and Available Events) instead of a "Select point" placeholder.

## ADDED Requirements

### Requirement: Independent Explore Mode

The system SHALL provide a dedicated "Explore" mode within the sliding canvas that is independent of the Map's state.

#### Scenario: Entering Explore Mode

- **WHEN** the user toggles the "Explore" mode in the main HUD
- **THEN** the system SHALL slide the canvas to reveal the Discovery Feed without modifying the active filters on the Map mode.
