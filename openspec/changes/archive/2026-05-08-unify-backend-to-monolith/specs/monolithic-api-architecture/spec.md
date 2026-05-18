## ADDED Requirements

### Requirement: Unified API Entry Point

The backend SHALL expose a single unified entry point for all system capabilities (Auth, Geo, Social) on a shared port.

#### Scenario: Unified Request Handling

- **WHEN** a request is made to `/v1/auth`, `/v1/geo`, or `/v1/social`
- **THEN** the request MUST be handled by the same Node.js process without inter-service HTTP proxying.

### Requirement: Monolithic Shared Context

The system SHALL share the configuration context and database connection pool across all backend modules to optimize resource usage.

#### Scenario: Database Pool Efficiency

- **WHEN** the API service starts
- **THEN** it MUST initialize a single database connection pool that is accessible by all internal module controllers.
