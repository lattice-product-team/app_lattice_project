## MODIFIED Requirements

### Requirement: Container Name Consistency

The system SHALL use consistent service names across development and production Docker Compose files to simplify networking configuration.

#### Scenario: Environment Consistency

- **WHEN** comparing `docker-compose.yml` and `docker-compose.prod.yml`
- **THEN** the core service identifiers (`api`, `admin-web`, `db`) MUST be identical to ensure stable host resolution across environments.

## ADDED Requirements

### Requirement: Atomic Backend Build
The CI/CD pipeline SHALL produce exactly one Docker image representing the entire backend API.

#### Scenario: Single Backend Artifact
- **WHEN** the GitHub Action completes the build phase
- **THEN** only two application images (`api` and `admin-web`) MUST be pushed to the container registry.
