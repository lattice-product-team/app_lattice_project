## ADDED Requirements

### Requirement: Event-to-POI Parent Linking
The system SHALL support a hierarchical relationship where an Event acts as the EXCLUSIVE parent to Points of Interest (POIs), bypassing the need for a global Venue context.

#### Scenario: Linking child POIs to an Event
- **WHEN** a POI is defined in the system
- **THEN** it MUST be directly referenced by an Event ID, without requiring an underlying Venue relationship.

### Requirement: Contextual POI Highlighting
The map system SHALL prioritize the visibility of child POIs when their parent Event is actively selected or being explored.

#### Scenario: Visual isolation on event selection
- **WHEN** the user selects a specific Event from the discovery list
- **THEN** the map SHOULD highlight its child POIs and optionally dim or suppress unrelated global POIs to reduce visual clutter.

### Requirement: Unified Event Category Model
The system SHALL use a unified category model that distinguishes between the "Event Category" (e.g., Music Festival) and the "POI Type" (e.g., Main Stage, Food Court).

#### Scenario: Category filtering
- **WHEN** filtering by "Música"
- **THEN** the system MUST show the parent Events of that category, and upon selection, expose the specific POIs regardless of their internal type.
