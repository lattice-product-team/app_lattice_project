## MODIFIED Requirements

### Requirement: Unified API Entry Point

The backend SHALL expose a single unified entry point for all system capabilities (Auth, Geo, Social) on a shared port (3000). To simplify external proxying, all routes SHALL be mounted at the root level of the application without mandatory versioned prefixes (e.g., `/auth/login` instead of `/api/v1/auth/login`).

#### Scenario: Unversioned Request Handling

- **WHEN** a request is made to an unversioned endpoint (e.g., `/health`, `/auth/login`)
- **THEN** the request MUST be handled by the corresponding module controller directly from the application root.
