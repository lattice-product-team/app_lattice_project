## ADDED Requirements

### Requirement: Secure Password Hashing

The system SHALL use Bcrypt with a minimum cost factor of 10 to hash passwords before storing them in the database.

#### Scenario: Registering with hashed password

- **WHEN** a user registers with a plaintext password
- **THEN** the database MUST store a Bcrypt hash and NEVER the plaintext password

### Requirement: Cryptographically Signed JWT Tokens

The system SHALL generate JWT tokens signed with a secret key using the HS256 algorithm for all authenticated sessions.

#### Scenario: Token Generation

- **WHEN** a user successfully logs in
- **THEN** the returned token MUST be a valid JWT signed with the system's JWT_SECRET

### Requirement: Robust Token Verification

The system SHALL verify the signature and expiration of JWT tokens for every protected request.

#### Scenario: Accessing protected route with valid token

- **WHEN** a request is made with a valid, signed JWT
- **THEN** the system SHALL permit access and correctly identify the user

#### Scenario: Accessing protected route with tampered token

- **WHEN** a request is made with a token whose signature is invalid or has been modified
- **THEN** the system SHALL return a 401 Unauthorized error
