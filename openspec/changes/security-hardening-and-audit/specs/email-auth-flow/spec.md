## MODIFIED Requirements

### Requirement: Email Registration
The system SHALL allow users to create an account using a full name, email, and password. The system MUST ensure the password is never stored in plaintext and is hashed using a secure algorithm (Bcrypt) before persistence.

#### Scenario: Successful Registration
- **WHEN** the user provides a valid full name, unique email, and strong password
- **THEN** a new account is created with a hashed password, the user is authenticated with a signed JWT, and redirected to `/(main)`

### Requirement: Email Login
The system SHALL allow users to sign in using their registered email and password. Verification MUST be performed by comparing the provided password against the stored secure hash.

#### Scenario: Successful Login
- **WHEN** the user enters correct credentials
- **THEN** the user is authenticated with a cryptographically signed JWT and redirected to `/(main)` (or `intendedDestination`)
