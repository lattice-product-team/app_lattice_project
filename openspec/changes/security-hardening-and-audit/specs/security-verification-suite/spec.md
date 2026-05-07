## ADDED Requirements

### Requirement: Cryptographic Integrity Tests
The test suite SHALL include integration tests that verify passwords cannot be retrieved in plaintext and that JWT signatures are strictly enforced.

#### Scenario: Verification of Hashing in Integration Tests
- **WHEN** the integration test suite runs
- **THEN** it SHALL verify that `passwordHash` values in the database are valid Bcrypt strings

### Requirement: Gateway Proxy Security Validation
The test suite SHALL verify that the Gateway correctly applies security headers and CORS policies.

#### Scenario: Automated Header Check
- **WHEN** running Gateway integration tests
- **THEN** every response MUST be checked for the presence of mandatory security headers
