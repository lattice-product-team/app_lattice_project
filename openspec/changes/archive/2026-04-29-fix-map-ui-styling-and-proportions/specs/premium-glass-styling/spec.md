## ADDED Requirements

### Requirement: Standardized Glass Tokens

The system SHALL provide `glass.subtle` and `glass.subtleBorder` tokens in both light and dark themes with high visual contrast.

#### Scenario: Light Mode Visibility

- **WHEN** the application is in light mode
- **THEN** `glass.subtle` background SHALL be clearly distinguishable from the main background (min 0.06 alpha)

#### Scenario: Dark Mode Consistency

- **WHEN** the application is in dark mode
- **THEN** `glass.subtle` SHALL maintain the "Midnight" aesthetic with a subtle highlight (min 0.08 alpha)

### Requirement: Proportional Layout for Discovery Content

The map discovery content (Categories and POIs) SHALL maintain their intended aspect ratios and spacing regardless of the bottom sheet state.

#### Scenario: Non-compressed Carousel

- **WHEN** the map bottom sheet is opened to medium height
- **THEN** POI carousel cards SHALL maintain a height of at least 180px and not be compressed vertically.

#### Scenario: Spaced Category Filters

- **WHEN** category filters are rendered
- **THEN** each filter chip SHALL have a minimum horizontal spacing of 10px from adjacent chips.
