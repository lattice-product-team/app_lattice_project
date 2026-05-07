## ADDED Requirements

### Requirement: Email Registration
The system SHALL allow users to create an account using a full name, email, and password.

#### Scenario: Successful Registration
- **WHEN** the user provides a valid full name, unique email, and strong password
- **THEN** a new account is created, the user is authenticated, and redirected to `/(main)`

### Requirement: Email Login
The system SHALL allow users to sign in using their registered email and password.

#### Scenario: Successful Login
- **WHEN** the user enters correct credentials
- **THEN** the user is authenticated and redirected to `/(main)` (or `intendedDestination`)

#### Scenario: Invalid Credentials
- **WHEN** the user enters an incorrect email or password
- **THEN** the system SHALL display a clear error message and remain on the login screen

### Requirement: Redirection Logic
The system SHALL ensure that after any successful authentication, the user is redirected to the correct destination.

#### Scenario: Redirection to Intended Destination
- **WHEN** a user is prompted to login while trying to access a specific feature (e.g., tickets)
- **THEN** after successful login, they SHALL be redirected to that specific feature instead of the home screen
