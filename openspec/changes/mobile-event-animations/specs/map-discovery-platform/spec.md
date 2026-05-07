## MODIFIED Requirements

### Requirement: Unified Discovery & Detail Transition
The system SHALL allow seamless transitions between general event discovery and specific POI details within the same unified bottom sheet architecture. Furthermore, any transition to a specific detail view MUST trigger a synchronized map camera animation to the selected entity's location.

#### Scenario: Opening POI Details
- **WHEN** a user selects a POI from the discovery list
- **THEN** the content MUST update to show POI details without the sheet detaching or resetting its "Island" layout properties.

#### Scenario: Camera Synchronization on List Selection
- **WHEN** a user selects a POI or event from the discovery list
- **THEN** the map camera MUST fly to the location of the selected entity using an offset layout.
