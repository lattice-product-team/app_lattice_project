## ADDED Requirements

### Requirement: Tailwind Eleven Integration

The system SHALL integrate Eleven design tokens into the Tailwind configuration of the Admin Web application, enabling utility classes for `bg-eggshell`, `bg-powder`, `text-obsidian`, and `text-gravel`.

#### Scenario: Verify Utility Usage

- **WHEN** a component uses the `bg-eggshell` utility class
- **THEN** it MUST render with the background color #fdfcfc.

### Requirement: Waldenburg Editorial Typography

The system SHALL configure Waldenburg 300 (or its Cormorant Garamond equivalent) as the primary display serif font, accessible via the `waldenburg-display` class with a default letter-spacing of -0.02em.

#### Scenario: Display Header Style

- **WHEN** a header uses the `waldenburg-display` class
- **THEN** it MUST render with a weight of 300 and negative tracking to achieve the editorial look.
