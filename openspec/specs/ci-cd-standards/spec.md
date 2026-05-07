## ADDED Requirements

### Requirement: Direct Secret Injection in CI/CD

The deployment pipeline MUST inject secrets directly into the container environment via Docker Compose variables instead of generating `.env` files on the deployment host.

#### Scenario: Secure Secret Deployment

- **WHEN** the GitHub Action runs the deployment step
- **THEN** it MUST pass secrets as environment variables to the `docker compose up` command, ensuring no `.env` file persists on the host.

### Requirement: Container Name Consistency

The system SHALL use consistent service names across development and production Docker Compose files to simplify networking configuration.

#### Scenario: Environment Consistency

- **WHEN** comparing `docker-compose.yml` and `docker-compose.prod.yml`
- **THEN** the core service identifiers (e.g., `auth`, `gateway`) MUST be identical or mapped via a consistent host variable pattern.
