## MODIFIED Requirements

### Requirement: Interactive Category Filtering
The system SHALL allow users to filter visible POIs on the map by selecting categories from either the Event Detail Sheet or the Level 2 Discovery Dashboard.

#### Scenario: Category Filter Active from Dashboard
- **WHEN** a user selects a category from the Discovery Dashboard
- **THEN** the system SHALL update the map to show only POIs matching that category
- **THEN** matching POIs SHALL remain visible while non-matching POIs SHALL be hidden or dimmed

#### Scenario: Category Filter Active from Event Detail Sheet
- **WHEN** a user selects a category from the Event Detail Sheet summary
- **THEN** the system SHALL highlight all POIs matching that category and dim all other visible POIs

#### Scenario: Clear Filter
- **WHEN** the user deselects the category or resets the discovery state
- **THEN** the system SHALL restore full visibility to all appropriate POIs based on the current zoom level
