## ADDED Requirements

### Requirement: Unified Lucide Icon Language
The system SHALL use `lucide-react-native` as the primary and exclusive icon library for all mobile UI components.

#### Scenario: Consistent Icon Style
- **WHEN** any UI component renders an icon
- **THEN** it MUST use a Lucide icon with a standard stroke weight of 2.0 or 2.2 to maintain visual harmony across the application.

### Requirement: Standardized Icon Geometry
The system SHALL enforce standardized sizing and stroke weights for all functional icons to ensure a cohesive editorial aesthetic.

#### Scenario: Icon Scaling
- **WHEN** an icon is scaled for different button sizes
- **THEN** the stroke weight MUST remain proportional to the container to prevent visual "bleeding" or excessive thinness.
