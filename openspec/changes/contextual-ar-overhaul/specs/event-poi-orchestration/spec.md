## MODIFIED Requirements

### Requirement: Contextual POI Highlighting

The map system SHALL prioritize the visibility of child POIs when their parent Event is actively selected or being explored.

#### Scenario: Visual isolation on event selection

- **WHEN** the user selects a specific Event from the discovery list
- **THEN** the map SHOULD highlight its child POIs and optionally dim or suppress unrelated global POIs to reduce visual clutter.

#### Scenario: AR context awareness

- **WHEN** AR is active and the user is inside an event boundary
- **THEN** the system MUST exclusively pass the POIs of that event to the AR renderer, suppressing other events.
