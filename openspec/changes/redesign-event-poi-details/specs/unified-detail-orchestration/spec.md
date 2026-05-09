## ADDED Requirements

### Requirement: Unified Data Normalization
The system SHALL provide a normalization layer that maps diverse data sources (Events from `useEventStore`, POIs from `usePOIStore`, or external API results) into a single `PremiumDetailModel`.

#### Scenario: Normalizing an Event
- **WHEN** an Event object is passed to the orchestration layer
- **THEN** it MUST extract the name, primary image, branding logo (if available), description, and relevant action links (Tickets, Website) into a standardized format.

#### Scenario: Normalizing a POI
- **WHEN** a POI object is passed to the orchestration layer
- **THEN** it MUST extract the display name, category icon, opening hours, rating, and distance into the same standardized format.

### Requirement: Content-Aware Section Visibility
The Premium Detail Sheet SHALL dynamically show or hide UI sections based on the presence of data in the `PremiumDetailModel`.

#### Scenario: Missing ratings for a POI
- **WHEN** a POI has no rating data
- **THEN** the Metric Grid SHALL hide the rating column and redistributing the remaining columns to fill the space.

#### Scenario: Event without tickets
- **WHEN** an event has no ticket link
- **THEN** the Action Pill Bar SHALL NOT display the "Tickets" pill.
