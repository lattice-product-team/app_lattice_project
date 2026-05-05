## MODIFIED Requirements

### Requirement: Unified Typography (Inter)
The system SHALL define "Inter" (with appropriate fallbacks) as the primary font family for all UI text to ensure a serious and professional aesthetic. For administrative interfaces, the system SHALL enforce a maximum base size of 14px for primary content.

#### Scenario: Typography Token Availability
- **WHEN** the `@app/theme` package is inspected
- **THEN** it MUST contain a `fontFamily` token set to `Inter, system-ui, sans-serif` and a `fontSize.admin-base` token set to `14px`.

### Requirement: Expanded Neutral Hierarchy (Dual-Theme)
The system SHALL provide both **Light and Dark** neutral scales, each supporting multiple elevation levels (Base, Surface, Elevated, Overlay). The Light theme SHALL use a "Warm Light" palette to maintain brand harmony.
**Update**: Include HeroUI-specific mappings and OKLCH helper values for unified rendering across web and mobile. Administrative surfaces MUST use refined neutral values to reduce contrast fatigue.

#### Scenario: Surface Separation in Dual-Theme
- **WHEN** the system is in Light or Dark mode
- **THEN** it SHALL provide corresponding `bg-base` and `bg-surface` tokens from the active theme's neutral scale.

#### Scenario: HeroUI Token Mapping
- **WHEN** the `@app/theme` package is used in `admin-web`
- **THEN** it MUST automatically map the Solar Gold and Neutral tokens to HeroUI's CSS variables.
