## ADDED Requirements

### Requirement: Automated Pull Request Validation
The CI/CD pipeline SHALL automatically execute linting, type-checking, and testing suites for every Pull Request targeting the `dev` branch.

#### Scenario: PR test execution
- **WHEN** a Pull Request is opened or updated targeting the `dev` branch
- **THEN** the GitHub Action MUST trigger the `quality` job and report success or failure to the PR status.

### Requirement: Continuous Deployment to Production
The CI/CD pipeline SHALL automatically deploy the application to the production environment when code is pushed to the `main` branch.

#### Scenario: Automated production deploy
- **WHEN** a push event occurs on the `main` branch
- **THEN** the GitHub Action MUST execute the `deploy` job after successfully passing the `quality` job.

### Requirement: Automated Deployment to Staging
The CI/CD pipeline SHALL automatically deploy the application to the staging environment when code is merged into the `dev` branch.

#### Scenario: Automated staging deploy
- **WHEN** a push event occurs on the `dev` branch (typically via PR merge)
- **THEN** the GitHub Action MUST execute a staging deployment job.
