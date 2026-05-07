## ADDED Requirements

### Requirement: Host-Based Service Discovery

Backend services SHALL use environment variables for service hosts (e.g., `AUTH_HOST`, `GEO_HOST`, `SOCIAL_HOST`) instead of hardcoded strings like `localhost` or specific container names in the code.

#### Scenario: Local to Docker Switch

- **WHEN** the `AUTH_HOST` variable is changed from `localhost` to `auth`
- **THEN** the Gateway service MUST route all auth requests to the new host without code modification.

### Requirement: Port Standardization

The system SHALL use standard variables for service ports (e.g., `AUTH_PORT`, `GEO_PORT`) that are shared across all environments.

#### Scenario: Port Change

- **WHEN** a service port is updated in the root `.env`
- **THEN** both the service listener and all proxying clients MUST reflect this change automatically.
