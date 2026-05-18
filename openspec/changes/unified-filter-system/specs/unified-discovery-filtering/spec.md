## ADDED Requirements

### Requirement: Synchronized Discovery Filtering

The system SHALL synchronize category filters across the Discovery Dashboard, the map interface, and the dashboard's event carousel.

#### Scenario: Selecting a Category in Dashboard

- **WHEN** the user selects a category chip (e.g., "Música") in the Discovery Dashboard
- **THEN** the system SHALL update the global filter state
- **THEN** the system SHALL filter the map to show only matching POIs
- **THEN** the system SHALL filter the dashboard's event carousel to show only matching events

### Requirement: Multi-Layer Filter Persistence

The system SHALL maintain the active category filters when transitioning between Discovery Dashboard levels (Level 2) and the search experience (Level 3).

#### Scenario: Maintaining Filters during Search

- **WHEN** a category filter is active in Level 2
- **AND** the user expands the island to Level 3 to search
- **AND** the user returns to Level 2
- **THEN** the category filter SHALL remain active and correctly reflected in the UI

### Requirement: Visual Feedback for Active Filters

The system SHALL provide clear visual feedback in the Discovery Dashboard to indicate which category filters are currently active.

#### Scenario: Filter Selection Visuals

- **WHEN** a category is selected
- **THEN** the corresponding chip in the Discovery Dashboard SHALL transition to an "active" visual state (using the category's semantic color)
- **THEN** other chips SHALL remain in their default "inactive" state
