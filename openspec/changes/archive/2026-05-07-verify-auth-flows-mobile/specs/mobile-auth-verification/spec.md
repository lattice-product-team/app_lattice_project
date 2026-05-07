## ADDED Requirements

### Requirement: Authentication Verification Matrix

The development process SHALL include a verification step for all authentication flows to ensure consistency across themes and devices.

#### Scenario: Theme Consistency Verification

- **WHEN** switching between Light and Dark mode on any authentication screen
- **THEN** all text, buttons, and input fields SHALL remain legible and match the theme tokens

#### Scenario: Error State Verification

- **WHEN** testing various failure modes (wrong password, existing email, no network)
- **THEN** the UI SHALL provide descriptive and user-friendly error messages that do not reveal sensitive system information

#### Scenario: Session Persistence Verification

- **WHEN** the user closes and re-opens the app after successful login
- **THEN** the session SHALL be persisted and the user SHALL bypass the onboarding/login screens
