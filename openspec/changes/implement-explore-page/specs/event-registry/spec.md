## MODIFIED Requirements

### Requirement: Social Metadata Persistence

The event data model SHALL include optional fields within its metadata for external social proof and discovery categorization.

#### Scenario: Event with discovery flags

- **WHEN** an event is fetched via API
- **THEN** it SHALL include optional `is_featured` (boolean) and `is_trending` (boolean) flags in its metadata to facilitate server-side feed orchestration.
