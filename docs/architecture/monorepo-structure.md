# Monorepo Structure

Lattice uses a **pnpm monorepo** managed by **Turborepo**. This architecture allows us to maintain multiple applications while sharing code, types, and configurations in a single repository.

## Directory Layout

```text
.
├── apps/                # Deployable applications
│   ├── admin-web/       # Next.js Admin Dashboard
│   ├── mobile/          # React Native / Expo App
│   └── server/          # Express API Monolith
├── packages/            # Shared internal libraries
│   ├── core/            # Logging, Middleware, Config
│   ├── db/              # Drizzle Schema & Migrations
│   ├── theme/           # Design System tokens (Colors, Spacing)
│   └── types-schema/    # Shared TS Interfaces
└── docs/                # Project Documentation
```

## Shared Packages Strategy

The core strength of our architecture lies in the `packages/` directory. By sharing code, we eliminate "Type Drift" between the backend and frontend.

### 1. `@app/db`

The Single Source of Truth (SSOT) for our data model.

- Defines the PostgreSQL schema using Drizzle ORM.
- Contains all database migrations.
- Exported types are used by the server to ensure query safety.

### 2. `@app/types-schema`

Universal TypeScript definitions.

- Infers types directly from the DB schema.
- Defines API Request/Response interfaces.
- Consumed by both `apps/server` and `apps/mobile`.

### 3. `@app/theme`

The visual DNA of Lattice.

- Shared color palettes, typography, and spacing constants.
- Ensures the "Lattice Red" is the exact same hex code in the Admin Dashboard and the Mobile App.

## Workspace Management

- **Dependency Management**: We use `pnpm` with workspaces. To add a shared package to an app, we use `pnpm add @app/db --filter server`.
- **Build Pipeline**: `turbo run build` orchestrates the build order based on the dependency graph (e.g., building `packages/db` before `apps/server`).
