## ADDED Requirements

### Requirement: Centralized Monorepo Build Configuration
The system SHALL support triggering cloud builds from the project root to ensure full visibility of monorepo workspaces and shared dependencies.

#### Scenario: Triggering Build from Root
- **WHEN** the user executes a mobile build command from the monorepo root
- **THEN** the system SHALL use the `eas.json` located at the root
- **AND** the system SHALL correctly resolve local workspace dependencies (e.g., `@app/theme`)

### Requirement: Single Source of App Truth
The system SHALL prevent configuration conflicts by ensuring only one valid Expo app configuration exists for each mobile application within the monorepo.

#### Scenario: Conflicting Root Config Removal
- **WHEN** the system is prepared for a mobile build
- **THEN** it SHALL NOT encounter a generic `app.json` at the monorepo root that conflicts with the specific app configuration in `apps/mobile/`
