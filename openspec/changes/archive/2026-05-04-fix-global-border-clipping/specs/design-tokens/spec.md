## ADDED Requirements

### Requirement: Standardized Border Contrast

The design tokens SHALL provide border colors that maintain a perceptible contrast against their respective backgrounds in both light and dark modes. The glass border in light mode MUST have at least 8% opacity to ensure visibility on high-DPI screens.

#### Scenario: Light Mode Border Visibility

- **WHEN** the system is in Light mode
- **THEN** the `glass.border` token MUST have a minimum alpha value of 0.08 (8%)

### Requirement: Uniform Border Thickness

The system SHALL standardize the primary UI border thickness to 1px (logical pixels) instead of sub-pixel hairlines to ensure consistent anti-aliasing across devices.

#### Scenario: Verifying Border Thickness

- **WHEN** a component uses the standard theme border
- **THEN** the `borderWidth` MUST be 1px
