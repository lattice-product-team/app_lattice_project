## ADDED Requirements

### Requirement: POI Social Metadata Support

The point of interest data model SHALL support optional social metrics fetched from external sources.

#### Scenario: POI with external rating

- **WHEN** a POI is retrieved via the Geo API
- **THEN** it SHALL include `external_rating` and `external_reviews_count` in its properties if linked to a Google Maps listing

### Requirement: Manual Social Linkage

The POI editor in the admin map SHALL allow administrators to manually paste a Google Maps CID or URL to link a POI.

#### Scenario: Manual override

- **WHEN** an admin provides a direct Google Maps link in the POI properties
- **THEN** the system SHALL prioritize this link for fetching social data over automatic matching
