## ADDED Requirements

### Requirement: Automatic Token Injection
The `apiClient` SHALL retrieve the authentication token from MMKV storage and include it as a `Bearer` token in the `Authorization` header for all outgoing requests if a token is present.

#### Scenario: Request with stored token
- **WHEN** a token exists in MMKV storage
- **THEN** every `apiClient` call SHALL include the `Authorization` header automatically.

#### Scenario: Request without stored token
- **WHEN** no token exists in MMKV storage
- **THEN** the `apiClient` call SHALL NOT include the `Authorization` header.
