## ADDED Requirements

### Requirement: Root-Initiated Cloud Builds
The Android cloud build process SHALL be initiated from the monorepo root to ensure proper inclusion of all workspace assets and dependencies.

#### Scenario: Execution from Root
- **WHEN** the user runs the `pnpm mobile:android:dev` script from the root
- **THEN** the system SHALL execute `eas build` targeting the `apps/mobile` directory
- **AND** the build process SHALL successfully complete dependency installation using the root `pnpm-lock.yaml`
