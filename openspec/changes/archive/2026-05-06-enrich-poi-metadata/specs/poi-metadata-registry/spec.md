## ADDED Requirements

### Requirement: Flexible Metadata Storage
The system SHALL provide a JSON metadata field for each POI to store category-specific information like opening hours, website links, or ratings.

#### Scenario: Accessing extended info
- **WHEN** the system renders a POI with "restaurant" type
- **THEN** it MUST be able to parse the metadata field to display specific items like "Website", "Rating" or "Opening Hours".

### Requirement: Core Metadata Fields
The metadata field SHALL support standardized keys for `website`, `rating`, and `openingHours`.

#### Scenario: Standard metadata display
- **WHEN** a POI has a `website` defined in its metadata
- **THEN** the admin dashboard and mobile app MUST show a clickable link to that website.
