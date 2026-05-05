## ADDED Requirements

### Requirement: Admin Typography Scale
The system SHALL define a reduced typography scale specifically for administrative interfaces, optimized for data-dense layouts. The base font size MUST be 14px (text-sm) for primary body text and 12px (text-xs) for labels and metadata.

#### Scenario: Verify Font Size
- **WHEN** an administrator views the dashboard
- **THEN** the primary body text MUST render at 14px and labels MUST render at 12px.

### Requirement: HeroUI v3 Table Compliance
The system SHALL implement all tables using the HeroUI v3 API, ensuring each table has exactly one column marked with `isRowHeader` for accessibility. The use of the legacy `align` prop MUST be prohibited in favor of CSS-based alignment.

#### Scenario: Table Accessibility
- **WHEN** a screen reader interacts with a dashboard table
- **THEN** it MUST correctly identify the row header column.

### Requirement: Theme-Aware Surface Semantic
The administrative interface SHALL use semantic surface tokens that adjust contrast specifically for dense layouts. In Dark Mode, surfaces MUST use a solid `#141413` (Surface) and `#1C1C1B` (Elevated) to provide clear depth without relying on excessive shadows.

#### Scenario: Dark Mode Contrast
- **WHEN** switching the admin interface to Dark Mode
- **THEN** the cards MUST use the `Surface` (#141413) background to ensure legibility against the `Base` (#0A0A09) background.
