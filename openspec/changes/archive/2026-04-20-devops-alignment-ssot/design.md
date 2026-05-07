## Context

The current environment configuration is fragmented across multiple `.env` files and hardcoded values in `docker-compose.yml` and GitHub Actions. This leads to configuration drift, security risks (hardcoded credentials), and manual friction when switching between local and Dockerized development environments.

## Goals / Non-Goals

**Goals:**

- Centralize all environment configuration in a single root `.env` file.
- Automate prefixing for Expo (mobile) variables.
- Standardize service networking using host variables (`AUTH_HOST`, etc.).
- Implement "Option A" deployment: direct secret injection into Docker Compose via GitHub Actions.
- Ensure Turbo cache integrity by tracking environment changes.

**Non-Goals:**

- Implementing a third-party secret manager (e.g., Vault, AWS Secrets Manager).
- Refactoring service business logic.
- Changing the deployment target/hosting provider.

## Decisions

### 1. Root Master .env as SSOT

- **Decision**: All configuration variables will live in the root `.env`. Sub-packages will reference this file during local development.
- **Rationale**: Prevents drift where one service has an outdated `DATABASE_URL` compared to others.
- **Alternatives Considered**: Keeping per-folder `.env` files. _Rejected_ because it's the root cause of the current "drift" issues.

### 2. Host Variable Abstraction

- **Decision**: Replace hardcoded `http://localhost:3001` or `http://auth:3001` with `http://${AUTH_HOST}:${AUTH_PORT}` in all service configurations.
- **Rationale**: Allows the same code to run seamlessly in local (Host=localhost), Docker Dev (Host=auth), and Production (Host=lattice_auth) environments by simply changing the host variable in the environment.
- **Alternatives Considered**: Using a service mesh or hardcoded conditional logic. _Rejected_ as too complex for the current scale.

### 3. Sync Script for Mobile (Expo)

- **Decision**: Create a utility script `scripts/sync-env.ts` (or shell script) that reads the root `.env` and generates `apps/mobile/.env` with the mandatory `EXPO_PUBLIC_` prefix for all relevant keys.
- **Rationale**: Expo requires the `EXPO_PUBLIC_` prefix for variables to be available in the client bundle. Maintaining two separate files manually is error-prone.
- **Alternatives Considered**: Manual prefixing in the root `.env`. _Rejected_ because it pollutes variables for backend services.

### 4. Secret Injection (Option A) in CI/CD

- **Decision**: Modify `.github/workflows/deploy-backend.yml` to pass GitHub Secrets directly to `docker compose up` using environment mapping, instead of `echo`ing into a `.env` file.
- **Rationale**: Improves security by not leaving `.env` files on the server's disk and simplifies the workflow.
- **Alternatives Considered**: Option B (generating a temporary `.env` file). _Rejected_ as less secure and more complex to manage across multiple services.

## Risks / Trade-offs

- **[Risk]** Root `.env` becomes bloated and hard to navigate. → **[Mitigation]** Use clear section headers and comments in `.env.example`.
- **[Risk]** Missing secrets in GitHub Actions cause silent failures. → **[Mitigation]** The deployment script will use `${VAR:?error}` syntax in Docker Compose to fail fast if a variable is unset.
- **[Risk]** Local developers might forget to run the sync script for mobile. → **[Mitigation]** Add the sync script to the `dev` and `start` scripts in `apps/mobile/package.json`.
