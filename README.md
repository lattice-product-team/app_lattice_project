# 📱 Lattice

Welcome to the official repository. This application is a full-stack solution built with **Express**, **Expo**, and **PostgreSQL**, organized in a **monorepo** with **Turborepo** and **Docker**.

> [!TIP]
> This project uses **Turborepo** to manage the monorepo. You can run commands from the root and they will be applied to all packages efficiently.

## Documentation Map

To ensure a smooth development process and perfect integration with AI agents, we maintain a "Source of Truth" in the following directories;

### Project Context (AI-Ready)

- **[System Prompt](docs/product/system-prompt.md)**: Code style guidelines and agent behavior.
- **[Architecture](docs/architecture/overview.md)**: Technical structure and data flow details.
- **[User Journeys](docs/product/user-journeys.md)**: Business logic and main user flows.
- **[Mobile Best Practices](docs/guides/mobile-best-practices.md)**: Expo guidelines and code style.

### Specifications and Guides

- **[Setup Guide](docs/guides/setup.md)**: How to set up the local environment with Docker.
- **[Deployment Guide](docs/guides/deployment.md)**: How to take the application to production.
- **[Contributor Guide](docs/guides/standards.md)**: Rules for branches, commits, and Pull Requests.

## Quick Start

> [!IMPORTANT]
> Make sure you have **Docker Desktop**/**Docker Compose** and **Node.js** (v18+) installed before starting.

1.  **Install**: `npm install` at the root.
2.  **Infrastructure**: `docker compose up -d` to start PostgreSQL and PostGIS.
3.  **Mobile Build**: `npm run android -w mobile` (Run this at least once to create the Development Build).
4.  **Development**: `npm run dev` to start all services (API + Mobile) simultaneously.
5.  **Remote Tunneling**: `npm run dev:zrok -w mobile` to expose the local API via a secure tunnel (zrok).

## Available Commands (Root)

You can manage the entire project directly from the root of the monorepo:

| Command                  | Description                                                 |
| :----------------------- | :---------------------------------------------------------- |
| `npm run dev`            | Starts development mode for API and Mobile.                 |
| `npm run build`          | Compiles all packages and applications.                     |
| `npm run lint`           | Runs the linter across the entire project.                  |
| `npm run test`           | Runs unit and integration tests.                            |
| `npm run format`         | Formats code across the entire project with Prettier.       |
| `npm run db:clean`       | Resets all database tables across the monorepo.             |
| `npm run db:seed-montmelo` | Populates the database with Montmeló venue data.          |
| `npm run db:seed-pedralbes` | Populates the database with Pedralbes test data.            |
| `npm run <cmd> -w <pkg>` | Runs a specific command in a workspace (e.g., `-w lattice`). |

## Testing Infrastructure

We have implemented a professional dual testing architecture in `apps/mobile`:

- **Logic Engine (Vitest):** For fast testing of logic, utilities, and hooks.
  - Command: `npm run test:logic -w mobile`
- **UI Engine (Jest + RTL):** For Expo UI and component validation.
  - Command: `npm run test:components -w mobile`
- **Full Suite:** `npm run test -w mobile`

More details in the **[Testing Guide](docs/guides/testing.md)**.

## Refactoring and Code Status

We have recently improved the maintainability of the mobile application:

- **Logic Extraction:** Map controls and location services have been decoupled from the main view (`MapScreen`) using custom hooks (`useLocationService`, `useMapControls`).
- **High-Performance Maps:** Transitioned to native MapLibre layers (`ShapeSource`, `CircleLayer`, `SymbolLayer`) for rendering thousands of points at 60fps, bypassing the overhead of standard markers.
- **Orientation-Aware AR:** The AR engine now supports landscape mode with a hybrid 2D/3D projection system for stable, professional labels regardless of device orientation.
- **Typography Unification:** Titles and fonts have been unified across the auth flow using a centralized `authStyles` SSOT in `typography.ts`, following the **[Design System](docs/guides/design-system.md)**.

### Database Management

> [!CAUTION]
> Use `migrate` with caution in production environments.

- `npm run db:generate`: Generates Drizzle migration files based on the schema.
- `npm run db:migrate`: Applies pending migrations to the database.
- `npm run db:clean`: Safely truncates all tables for environment reset.
- `npm run db:seed-montmelo`: Seeds the database for the Montmeló venue.
- `npm run db:seed-pedralbes`: Seeds the database for the Pedralbes test environment.
- `npm run db:studio`: Opens the Drizzle visual interface to explore data.

## Technology Stack

- **Frontend:** React Native via Expo (`apps/mobile`) with **React Three Fiber (R3F)** for Augmented Reality.
- **Backend:** Node.js **Microservices** (`apps/server/*`) orchestrated via Docker.
- **Shared:** Common types and logic (`packages/shared`).
- **Infrastructure:** Postgres + PostGIS via Docker, with Redis for real-time telemetry.
