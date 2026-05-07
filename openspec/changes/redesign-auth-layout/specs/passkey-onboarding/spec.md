## ADDED Requirements

### Requirement: Educational Intro Screen

The system SHALL display a high-fidelity "Lattice-branded" screen explaining the benefits of Passkeys (Security, Speed, No passwords) before triggering the native OS prompt.

#### Scenario: User reaches onboarding after registration

- **WHEN** the user completes a new registration
- **THEN** the system SHALL display the Passkey Intro screen
- **AND** SHALL provide "Enable Passkey" and "Skip for now" options

### Requirement: Native Credential Creation

The system SHALL use the platform's native biometric/security APIs to register a new Passkey credential.

#### Scenario: User accepts Passkey creation

- **WHEN** the user clicks "Enable Passkey"
- **THEN** the system SHALL trigger the native iOS/Android Passkey creation sheet
- **AND** upon success, SHALL register the public key with the Lattice backend

### Requirement: Smart Re-engagement

The system SHALL track the skip state and avoid nagging the user unnecessarily.

#### Scenario: User skips the prompt

- **WHEN** the user selects "Skip for now"
- **THEN** the system SHALL record the timestamp
- **AND** SHALL NOT show the prompt again for at least 7 days

### Requirement: Multi-method Fallback

The system SHALL ensure that Passkeys are an enhancement, not a replacement for traditional methods.

#### Scenario: Passkey authentication fails

- **WHEN** a user attempt to login via Passkey fails or the device is lost
- **THEN** the system SHALL allow the user to fallback to Email/Password or Social Login methods
