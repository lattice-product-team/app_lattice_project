## MODIFIED Requirements

### Requirement: Unified Discovery & Detail Transition
The system SHALL allow seamless transitions between general event discovery and specific POI details within the same unified bottom sheet architecture, with all content dynamically fetched from the spatial database.

#### Scenario: Opening POI Details
- **WHEN** a user selects a POI from the discovery list
- **THEN** the system MUST fetch the latest metadata and geometry from the server to update the view without the sheet detaching or resetting its "Island" layout properties.
