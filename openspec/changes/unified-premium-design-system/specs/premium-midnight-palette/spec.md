## ADDED Requirements

### Requirement: Midnight Core Surfaces
The Midnight palette SHALL define high-contrast dark surfaces to minimize light bleed and maximize premium atmosphere.

#### Scenario: Background verification
- **WHEN** the Midnight theme is active
- **THEN** the main background color MUST be `#0A0A0C` (Midnight Black).

### Requirement: Midnight Glass Specifications
The system SHALL define specific translucency and blur parameters for "Glass" elements in the Midnight context.

#### Scenario: Glass blur intensity
- **WHEN** a component uses the `Midnight Glass` token
- **THEN** it MUST apply a `dark` tint with a minimum intensity of `85%` and a subtle white border of `rgba(255, 255, 255, 0.1)`.

### Requirement: Solar Gold Accessibility
The Midnight palette MUST ensure that Solar Gold accents maintain a high contrast ratio against Midnight backgrounds.

#### Scenario: Accent contrast
- **WHEN** Solar Gold (`#EFB33F`) is used for text on a Midnight background
- **THEN** the contrast ratio MUST meet WCAG AA standards for accessibility.
