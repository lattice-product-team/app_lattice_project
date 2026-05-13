## ADDED Requirements

### Requirement: Multimedia Metadata Fields
The POI Metadata Registry SHALL include standardized support for multimedia fields: `banner_url` and `gallery_urls`.

#### Scenario: Storing POI gallery
- **WHEN** a POI is registered in the system
- **THEN** it SHALL be possible to store an array of image URLs in the `gallery_urls` field of the metadata.
