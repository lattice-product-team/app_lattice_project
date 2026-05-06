## MODIFIED Requirements

### Requirement: Expanded Neutral Hierarchy (Dual-Theme)
The system SHALL provide both **Light and Dark** neutral scales, each supporting multiple elevation levels (Base, Surface, Elevated, Overlay). The Light theme SHALL use a "Warm Light" palette to maintain brand harmony.
**Update**: Include HeroUI-specific mappings and OKLCH helper values for unified rendering across web and mobile.

#### Scenario: Surface Separation in Dual-Theme
- **WHEN** the system is in Light or Dark mode
- **THEN** it SHALL provide corresponding `bg-base` and `bg-surface` tokens from the active theme's neutral scale.

#### Scenario: HeroUI Token Mapping
- **WHEN** the `@app/theme` package is used in `admin-web`
- **THEN** it MUST automatically map the Solar Gold and Neutral tokens to HeroUI's CSS variables.
