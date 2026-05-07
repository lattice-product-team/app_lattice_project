## ADDED Requirements

### Requirement: Single Source of Truth

The system MUST use a single `.env` file at the root as the primary source for all configuration variables.

#### Scenario: Variable Centralization

- **WHEN** a developer adds a new variable to the project
- **THEN** it MUST be added to the root `.env` and `.env.example` only.

### Requirement: Expo Variable Synchronization

The system SHALL provide a script to synchronize root `.env` variables to `apps/mobile/.env` with the `EXPO_PUBLIC_` prefix for variables intended for the mobile app.

#### Scenario: Mobile Sync Execution

- **WHEN** the command `pnpm env:sync` is run from the root
- **THEN** an `apps/mobile/.env` file is generated containing all variables from root `.env` prefixed with `EXPO_PUBLIC_`.
