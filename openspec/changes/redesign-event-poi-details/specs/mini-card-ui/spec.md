## REMOVED Requirements

### Requirement: POI Mini-Card Transition
**Reason**: Replaced by the `redesign-event-poi-details` change which unifies all detail views into a single premium sheet architecture.
**Migration**: Use the new unified `PremiumDetailSheet` for both Events and POIs.

## ADDED Requirements

### Requirement: Unified POI Sheet Behavior
The system SHALL use the same `PremiumDetailSheet` component for individual POIs, ensuring they benefit from the same Level 1/2/3 interaction model as events.

#### Scenario: Selecting a POI
- **WHEN** a user selects a POI marker on the map
- **THEN** the system MUST animate the unified Detail Sheet from Level 0 to Level 2
- **AND** populate it with POI-specific data (Hours, Ratings, etc.).
