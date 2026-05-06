## MODIFIED Requirements

### Requirement: Global Event List
The system SHALL provide a comprehensive table of all managed events, supporting horizontal scrolling for high-density data viewing and exposing extended operational attributes.

#### Scenario: Global Event List Rendering
- **WHEN** the Operations Center or the dedicated Events page is loaded
- **THEN** it SHALL display a list of events sorted by `startDate`, including their current status (Live, Upcoming, Planning).

#### Scenario: High-Density Data Navigation
- **WHEN** the number of columns (including Category, Schedule, Address, and Capacity) exceeds the viewport width
- **THEN** the events table SHALL enable horizontal scrolling to allow full access to all operational data without breaking the layout or compromising the editorial aesthetic.

#### Scenario: Displaying Extended Event Attributes
- **WHEN** the events table is rendered
- **THEN** it SHALL include dedicated columns for the following attributes:
  - **Category**: The event type classification.
  - **Schedule**: The formatted date range (Start to End).
  - **Address**: The human-readable location resolved via geocoding.
  - **Capacity**: The estimated or maximum attendance, formatted for readability.
