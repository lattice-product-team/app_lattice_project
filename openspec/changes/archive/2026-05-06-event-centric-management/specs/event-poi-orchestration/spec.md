## MODIFIED Requirements

### Requirement: Event-to-POI Parent Linking

The system SHALL support a hierarchical relationship where an Event acts as the EXCLUSIVE parent to Points of Interest (POIs), bypassing the need for a global Venue context.

#### Scenario: Linking child POIs to an Event

- **WHEN** a POI is defined in the system
- **THEN** it MUST be directly referenced by an Event ID, without requiring an underlying Venue relationship.
