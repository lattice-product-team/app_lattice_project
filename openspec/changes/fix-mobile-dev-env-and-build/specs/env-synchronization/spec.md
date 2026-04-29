## MODIFIED Requirements

### Requirement: Expo Variable Synchronization
The system SHALL provide a script to synchronize root `.env` variables to `apps/mobile/.env` with the `EXPO_PUBLIC_` prefix for variables intended for the mobile app, and it MUST support runtime overrides for specific variables.

#### Scenario: Mobile Sync with IP Override
- **WHEN** the command `pnpm env:sync -- --ip 172.20.10.12` is run
- **THEN** the `apps/mobile/.env` file is generated where `EXPO_PUBLIC_GATEWAY_HOST` is set to `172.20.10.12`, regardless of the value in the root `.env`.
