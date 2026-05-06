## ADDED Requirements

### Requirement: Staging Environment Isolation
The system SHALL support a Staging environment that runs in parallel with Production on the same infrastructure using Docker project isolation.

#### Scenario: Staging deployment execution
- **WHEN** the deployment workflow targets the Staging environment
- **THEN** it MUST use a unique Docker project name (e.g., `app-lattice-staging`) to prevent interference with the Production containers.

### Requirement: Environment-Specific Configuration
The Staging environment MUST use its own set of environment variables and secrets, including a dedicated database connection.

#### Scenario: Database separation
- **WHEN** a service in Staging starts up
- **THEN** it MUST connect to the `STAGING_DATABASE_URL` instead of the production database.
