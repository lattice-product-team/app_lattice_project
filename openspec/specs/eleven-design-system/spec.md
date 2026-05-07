# eleven-design-system Specification

## Purpose

TBD - created by archiving change admin-web-eleven-style. Update Purpose after archive.

## Requirements

### Requirement: Eggshell-Centric Color System

The system SHALL define a color palette based on high-contrast achromatic values centered around an "Eggshell" (#fdfcfc) primary surface. The palette MUST include:

- `Eggshell` (#fdfcfc): Page ground and primary surface.
- `Powder` (#f5f3f1): Secondary surface for hover states.
- `Chalk` (#e5e5e5): Universal border and divider color.
- `Gravel` (#777169): Secondary text with a warm stone undertone.
- `Obsidian` (#000000): Primary text and CTA backgrounds.

#### Scenario: Verify Color Token Contrast

- **WHEN** the "Obsidian" text is rendered on an "Eggshell" background
- **THEN** it MUST achieve a contrast ratio of at least 20.5:1 to ensure extreme readability.

### Requirement: Light-Weight Serif Typography

The system SHALL implement a typography system where headlines are rendered using a light-weight serif (Waldenburg 300 or equivalent) with negative tracking (-0.02em).

- `waldenburg-300`: Headlines at 32px, 36px, and 48px.
- `inter-400/500`: Body copy and UI labels with 0.01em letter-spacing.

#### Scenario: Headline Aesthetics

- **WHEN** a display headline is rendered
- **THEN** it MUST use a weight of 300 and a letter-spacing of -0.96px (at 48px) to create a classical, editorial feel.

### Requirement: Hairline Elevation System

The system SHALL replace standard depth elevation with a hairline shadow system that maintains a flat perceptual plane.

- `subtle-shadow`: rgba(0, 0, 0, 0.4) 0px 0px 1px 0px.

#### Scenario: Card Elevation

- **WHEN** a UI card is displayed on the Eggshell ground
- **THEN** it MUST use the hairline shadow instead of large blurs to "hover" rather than "float".
