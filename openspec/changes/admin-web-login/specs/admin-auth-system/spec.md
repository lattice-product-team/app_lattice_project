## ADDED Requirements

### Requirement: Admin Authentication Shield
The admin-web environment SHALL be protected by an authentication layer that restricts access to the Global Operations Center.

#### Scenario: Unauthenticated Access Redirect
- **WHEN** an unauthenticated user attempts to access any route under `/` (except `/login`)
- **THEN** the system SHALL redirect the user to the `/login` page.

### Requirement: Single Admin Credential Verification
The system SHALL verify login attempts against a single set of administrator credentials defined in the environment configuration.

#### Scenario: Successful Login
- **WHEN** a user submits the correct admin email and password on the `/login` page
- **THEN** the system SHALL establish a secure session and redirect the user to the dashboard.

#### Scenario: Failed Login
- **WHEN** a user submits incorrect credentials
- **THEN** the system SHALL display an error message and remain on the `/login` page.

### Requirement: Secure Session Persistence
The system SHALL maintain the administrator's session using a secure, HTTP-only cookie.

#### Scenario: Session Token Validity
- **WHEN** a user with a valid session cookie accesses the dashboard
- **THEN** the system SHALL permit access without further authentication until the session expires.

### Requirement: Administrative Logout
The dashboard SHALL provide a mechanism for the administrator to explicitly terminate their session.

#### Scenario: Manual Logout
- **WHEN** the administrator clicks the logout button in the sidebar
- **THEN** the system SHALL invalidate the session cookie and redirect the user to the `/login` page.
