## ADDED Requirements

### Requirement: Real-time Event Search
The system SHALL allow administrators to filter the event list by typing a name into a search input.

#### Scenario: Search by Name
- **WHEN** an administrator types "Primavera" into the search input
- **THEN** only events with "Primavera" in their name SHALL be displayed in the list.

### Requirement: Event Status Filtering
The system SHALL provide a way to filter the event list by its operational status (Active, Past, All).

#### Scenario: Filtering for Active Events
- **WHEN** the "Active" filter is selected
- **THEN** only events whose end date is in the future SHALL be displayed.

### Requirement: Capacity-Based Filtering
The system SHALL allow administrators to filter events based on their estimated capacity.

#### Scenario: Filtering for Massive Events
- **WHEN** the "Massive" (>10,000 capacity) filter is selected
- **THEN** only events with capacity greater than 10,000 SHALL be displayed.
