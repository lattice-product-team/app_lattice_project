## Modified Requirements

### Requirement: Enhanced Event Data Structure

The event registration system MUST support a rich set of metadata and categorized images to improve discovery visual quality.

#### Scenario: Categorized Seeding

- **WHEN** the system is seeded with the "Rich Seed v2"
- **THEN** it MUST include at least 4 distinct categories (Music, Gastronomy, Tech, Sports).
- **AND** each event MUST include a placeholder image URL following the pattern `https://PLACEHOLDER.COM/IMAGE_<CATEGORY>_<ID>.JPG`.
- **AND** each event MUST have a social rating between 4.0 and 5.0.
