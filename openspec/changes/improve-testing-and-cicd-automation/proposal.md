## Why

The current testing infrastructure relies on mocks that don't validate real database interactions, leading to fragile tests that may miss SQL-level regressions. Additionally, the CI/CD pipeline lacks automated triggers for Pull Requests and production deployments, requiring manual intervention and slowing down the delivery cycle.

## What Changes

- **Automated Workflow Triggers**: Configure GitHub Actions to automatically run quality checks (lint, type-check, tests) on Pull Requests to the `dev` branch.
- **Production Deployment Automation**: Automate the deployment process to production whenever code is pushed or merged into the `main` branch.
- **Real Database Integration Testing**: Transition backend integration tests from using mocks to interacting with a real PostgreSQL/PostGIS database instance in the CI environment.
- **Frontend Testing Infrastructure**: Initialize a testing suite for the `admin-web` application using Vitest and React Testing Library.
- **Staging Environment Implementation**: Establish a staging environment that mirrors production for validating changes from the `dev` branch before they reach `main`.

## Capabilities

### New Capabilities

- `real-db-integration-testing`: Establishes a standard and infrastructure for backend tests to use live database instances.
- `admin-web-testing-suite`: Initial testing framework and baseline tests for the web administration dashboard.
- `staging-environment-setup`: Configuration and deployment flow for a pre-production staging environment.

### Modified Capabilities

- `ci-cd-standards`: Expanding CI/CD requirements to include automated branch-based triggers and environment-specific deployment flows.

## Impact

- **GitHub Actions**: Significant updates to `.github/workflows/deploy-backend.yml`.
- **Backend Services**: Updates to `apps/server/*/package.json` and addition of real integration tests.
- **Admin Web**: Addition of testing dependencies and configuration files (`apps/admin-web/vitest.config.ts`, etc.).
- **Infrastructure**: Potential addition of `docker-compose.staging.yml` or updates to existing compose files to support multiple environments.
