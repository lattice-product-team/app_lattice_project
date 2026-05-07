## ADDED Requirements

### Requirement: Event Category Classification
The system SHALL support classifying events into predefined categories such as Music, Tech, Sports, and Arts to improve organizational oversight.

#### Scenario: Visual Categorization in Table
- **WHEN** the admin dashboard renders the events table
- **THEN** each event SHALL display its category tag using a color-coded indicator for immediate recognition.

### Requirement: Capacity Visibility
The system SHALL display the estimated or maximum capacity for each event environment.

#### Scenario: Metadata-Driven Capacity
- **WHEN** capacity data is provided in the event's metadata
- **THEN** the events table SHALL display this value formatted with thousand separators (e.g., 45,000).

#### Scenario: Handling Missing Capacity
- **WHEN** an event has no capacity data defined
- **THEN** the table SHALL show a neutral placeholder (e.g., "—") to maintain visual consistency.
