## ADDED Requirements

### Requirement: Host-to-Container Permission Mapping

Production containers SHALL run as the non-root user matching the host runner's UID/GID (1000:1000) to ensure that build artifacts can be managed and cleaned by the CI/CD system.

#### Scenario: Clean repository sync

- **WHEN** the GitHub Action attempts to clean the workspace after a deployment
- **THEN** it MUST have permission to delete any files created by the application containers (e.g., `.next` cache).

## MODIFIED Requirements

### Requirement: Container Name Consistency

The system SHALL use consistent and explicit container names (e.g., `lattice_api`, `lattice_admin_web`) across production configurations to ensure stable DNS resolution by the global Nginx proxy.

#### Scenario: Proxy Host Resolution

- **WHEN** Nginx attempts to resolve `lattice_admin_web`
- **THEN** it MUST successfully connect to the correct container within the shared network.
