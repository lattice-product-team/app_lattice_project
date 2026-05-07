## ADDED Requirements

### Requirement: Venue/Event Selector

The dashboard SHALL provide a persistent selection mechanism that allows administrators to filter the operational view by specific Venues and Events.

#### Scenario: Switching Event Context

- **WHEN** an administrator selects a different event from the selector
- **THEN** all dashboard components (Header, Cards, Charts, Tables) MUST update to reflect the newly selected event's data.

### Requirement: Global View Fallback

The system SHALL provide a "Global View" or "All Events" summary when no specific event is selected, aggregating key metrics across the entire platform.

#### Scenario: No Event Selected

- **WHEN** the selector is set to "All Events"
- **THEN** the dashboard MUST show aggregated metrics (e.g., Total Active Users across all venues) and a list of active events.
