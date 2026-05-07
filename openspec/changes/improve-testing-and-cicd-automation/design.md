## Context

The project currently lacks automated CI/CD triggers, requiring manual dispatch for deployments. Testing is primarily unit-based with extensive mocking of the database layer, which fails to catch SQL errors or constraint violations. The `admin-web` application has no testing infrastructure configured.

## Goals / Non-Goals

**Goals:**

- Automate quality checks on Pull Requests to `dev`.
- Automate production deployments on push to `main`.
- Implement a reusable pattern for real database integration testing in the backend.
- Initialize Vitest and React Testing Library for `admin-web`.
- Define the technical approach for a Staging environment on the existing self-hosted runner.

**Non-Goals:**

- Implementing full End-to-End (E2E) testing for the mobile application.
- Migrating all existing mock-based tests to real database tests (only providing the infrastructure and examples).
- Setting up a separate physical server for staging (it will share the current host).

## Decisions

### Decision 1: Use GitHub Actions Services for Test Databases

**Rationale**: By using the `services` field in GitHub Actions, we get a clean PostgreSQL + PostGIS instance for every test run. This ensures test isolation and avoids polluting the host's database or requiring complex cleanup scripts.
**Alternatives**: Using a persistent test database on the runner (difficult to manage parallel runs) or mocking (current state, lacks robustness).

### Decision 2: Staging Environment via Docker Project Isolation

**Rationale**: We will use Docker Compose project names (`-p staging`) and environment-specific port mappings (e.g., 4000-4004) to run the Staging environment on the same self-hosted runner as Production. This is cost-effective and provides a mirror of the production configuration.
**Alternatives**: Separate VPS (higher cost) or Vercel/Netlify for frontend (limited by backend dependencies).

### Decision 3: Database Isolation via TRUNCATE

**Rationale**: In "Real DB" tests, we will use a `beforeEach` hook to `TRUNCATE` all tables. This is significantly faster than running migrations for every test while still ensuring each test starts with a clean slate.
**Alternatives**: Database transactions with rollback (can be tricky with multiple connections) or dropping/creating the database (too slow).

### Decision 4: Vitest for Admin Web

**Rationale**: To maintain consistency with the backend and mobile packages which already use Vitest, and to benefit from its superior speed and Next.js integration.

## Risks / Trade-offs

- **[Risk] Slower CI runs** → Real database interactions are slower than mocks. _Mitigation_: Reserve real DB tests for critical integration paths (Auth, Geo) and keep pure unit logic mock-based.
- **[Risk] Resource contention on Runner** → Running Production and Staging on the same host may cause CPU/RAM spikes. _Mitigation_: Monitor usage and implement Docker resource limits (`mem_limit`, `cpus`) if necessary.
- **[Risk] Database Schema Desync** → Staging or Tests might run with outdated schemas. _Mitigation_: Ensure `pnpm db:migrate` (or equivalent) is always part of the deployment/test startup sequence.
