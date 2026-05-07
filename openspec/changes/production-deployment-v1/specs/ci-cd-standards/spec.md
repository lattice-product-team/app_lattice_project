## ADDED Requirements

### Requirement: Two-Phase Deployment Pipeline

The CI/CD pipeline MUST be structured into two distinct phases: a Quality Phase (running on GitHub-hosted runners) and a Deploy Phase (running on self-hosted runners).

#### Scenario: Pipeline Execution Flow

- **WHEN** code is pushed to `main`
- **THEN** the `quality` job MUST complete successfully (tests/lints) BEFORE the `deploy` job begins on the self-hosted runner.

### Requirement: Production Build Isolation

The production build process SHALL compile all TypeScript applications and build Docker images specifically for the target production architecture on the self-hosted runner.

#### Scenario: Building for production

- **WHEN** the `deploy` job runs
- **THEN** it MUST execute `pnpm install` and `docker compose build` to ensure the artifacts are fresh and compatible with the host OS.
