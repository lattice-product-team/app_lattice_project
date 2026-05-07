## ADDED Requirements

### Requirement: Feature-First Directory Structure

The mobile codebase SHALL organize code into domain-specific features under `src/features/`.

#### Scenario: New feature creation

- **WHEN** a new domain like "Tickets" is introduced
- **THEN** it SHALL have its own folder `src/features/tickets` containing its specific components, hooks, and types

### Requirement: Generic UI Atom Separation

Generic UI components with no business logic SHALL reside in `src/components/ui/`.

#### Scenario: Reusing a button

- **WHEN** a feature needs a button
- **THEN** it SHALL import a generic atom from `src/components/ui/` instead of re-implementing it
