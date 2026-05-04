# Design Tokens Specification

## Requirements

### Requirement: Centralized Theme Package
The system SHALL provide a shared package `@app/theme` that exports all design tokens (colors, spacing, etc.) to ensure consistency across Mobile and Web Admin.

#### Scenario: Package Accessibility
- **WHEN** a developer imports from `@app/theme` in any workspace application
- **THEN** they MUST be able to access the brand, neutral, and semantic color scales.

### Requirement: Refined Brand Palette (Solar Gold)
The system SHALL define the "Solar Gold" palette as the primary brand identity, consisting of Primary (#E2B042), Secondary (#C59837), Accent (#F4C978), and Deep (#A67C27) tokens.

#### Scenario: Brand Color Availability
- **WHEN** the `@app/theme` package is inspected
- **THEN** it MUST contain the hex values for the refined Solar Gold palette.

### Requirement: Expanded Neutral Hierarchy (Dual-Theme)
The system SHALL provide both **Light and Dark** neutral scales, each supporting multiple elevation levels (Base, Surface, Elevated, Overlay). The Light theme SHALL use a "Warm Light" palette to maintain brand harmony.
**Update**: Include HeroUI-specific mappings and OKLCH helper values for unified rendering across web and mobile.

#### Scenario: Surface Separation in Dual-Theme
- **WHEN** the system is in Light or Dark mode
- **THEN** it SHALL provide corresponding `bg-base` and `bg-surface` tokens from the active theme's neutral scale.

#### Scenario: HeroUI Token Mapping
- **WHEN** the `@app/theme` package is used in `admin-web`
- **THEN** it MUST automatically map the Solar Gold and Neutral tokens to HeroUI's CSS variables.

### Requirement: WCAG AA Accessibility Compliance (Dual-Theme)
All primary text and background combinations in the design tokens MUST maintain a minimum contrast ratio of 4.5:1 (WCAG AA) in both Light and Dark modes.

#### Scenario: Contrast Verification - Dark Mode
- **WHEN** the `brand-primary` (#E2B042) is used on Dark `bg-base` (#0A0A09)
- **THEN** the contrast ratio MUST be greater than 4.5:1.

#### Scenario: Contrast Verification - Light Mode
- **WHEN** a dark semantic text color is used on Light `bg-base` (#FCFCFA)
- **THEN** the contrast ratio MUST be greater than 4.5:1.

### Requirement: Unified Typography (Inter)
The system SHALL define "Inter" (with appropriate fallbacks) as the primary font family for all UI text to ensure a serious and professional aesthetic.

#### Scenario: Typography Token Availability
- **WHEN** the `@app/theme` package is inspected
- **THEN** it MUST contain a `fontFamily` token set to `Inter, system-ui, sans-serif`.
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
