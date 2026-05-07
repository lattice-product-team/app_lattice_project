## ADDED Requirements

### Requirement: Centralized Theme State

The mobile application SHALL maintain a centralized state for the current active theme (Light or Midnight).

#### Scenario: Theme switching

- **WHEN** the theme state is toggled from Light to Midnight
- **THEN** all components consuming semantic tokens MUST re-render with the Midnight palette immediately.

### Requirement: Semantic Token Map

The system SHALL provide a mapping of semantic identifiers (e.g., `bg.main`, `text.primary`) to primitive color values based on the active theme.

#### Scenario: Token resolution

- **WHEN** a component requests `theme.colors.bg.main` while the theme is 'Midnight'
- **THEN** it MUST receive the deep black primitive value (`#0A0A0C`).

### Requirement: Type-Safe Theme Interface

The theme system MUST provide TypeScript definitions for all semantic tokens to ensure compile-time safety across the codebase.

#### Scenario: Code completion

- **WHEN** a developer types `theme.colors.` in a component
- **THEN** the IDE MUST suggest valid semantic tokens like `surface`, `border`, and `brand`.
