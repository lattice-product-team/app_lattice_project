## MODIFIED Requirements

### Requirement: Event-to-POI Parent Linking
The system SHALL support a direct relationship where an Event acts as the primary parent to multiple child Points of Interest (POIs), with no intermediate Venue layer.

#### Scenario: Linking child POIs to an Event
- **WHEN** an Event is defined in the system
- **THEN** it MUST be able to reference a collection of POI IDs that represent sub-locations (stages, gates, services) linked exclusively via `event_id`.
