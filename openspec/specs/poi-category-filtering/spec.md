# poi-category-filtering Specification

## Purpose

This spec defines the logic for filtering POIs by category on the map.

## Requirements

### Requirement: Interactive Category Filtering

The system SHALL allow users to filter visible POIs on the map by selecting categories from the Event Detail Sheet.

#### Scenario: Category Filter Active

- **WHEN** a user selects a category (e.g., "Food") from the sheet summary
- **THEN** the system SHALL highlight all POIs matching that category and dim all other visible POIs

#### Scenario: Clear Filter

- **WHEN** the user deselects the category or closes the sheet
- **THEN** the system SHALL restore full opacity to all visible POIs
