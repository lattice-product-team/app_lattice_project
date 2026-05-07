## ADDED Requirements

### Requirement: Independent Sheet Stacking

The system SHALL support rendering the Event Detail Sheet on top of the main Discovery Island. Both sheets MUST maintain their own animation states and vertical positions.

#### Scenario: Opening details over search

- **WHEN** a user selects an event from the search results
- **THEN** the Event Detail Sheet SHALL animate from Level 0 to Level 2
- **AND** the main Discovery Island SHALL remain visible underneath but disabled for interaction

### Requirement: Context Persistence

The system SHALL preserve the state of the main Discovery Island when the Event Detail Sheet is dismissed.

#### Scenario: Returning to search

- **WHEN** the user closes the Event Detail Sheet
- **THEN** the main Discovery Island MUST show the same search results or view it had before the detail sheet was opened

### Requirement: Responsive Corner Radius

The Event Detail Sheet SHALL adapt its corner radius based on its vertical position: 32px (all corners) at Level 2 (floating) and 0px (bottom corners) at Level 3 (expanded).

#### Scenario: Expanding to full screen

- **WHEN** the user drags the Detail Sheet from Level 2 to Level 3
- **THEN** the bottom corner radius MUST animate from 32px to 0px
