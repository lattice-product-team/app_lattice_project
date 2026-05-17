## ADDED Requirements

### Requirement: Documented Commands Must Match package.json Scripts
The documentation SHALL exclusively specify the valid and active monorepo scripts defined in the root `package.json` for starting development servers and initializing database migrations.

#### Scenario: Running mobile development in LAN mode
- **WHEN** the user opens the mobile setup guide
- **THEN** the guide specifies `pnpm dev:mobile:lan` and `pnpm dev:mobile:lan:prod` as the primary dev commands

#### Scenario: Running database migration tasks
- **WHEN** the developer executes database migrations
- **THEN** the onboarding documents specify `pnpm db:migrate` and `pnpm db:seed` instead of outdated filters

---

### Requirement: Documented Database Port Conflict-Free
The default local database port specified across all onboarding and troubleshooting documentation SHALL be `5433` to match the Docker container configurations and prevent host Postgres conflicts.

#### Scenario: Resolving postgres connection failures
- **WHEN** the developer consults the troubleshooting guide
- **THEN** the guide instructs to check that port `5433` is active for Docker Compose PG.

---

### Requirement: Relative Documentation Paths
All documentation links pointing to local workspace assets or files SHALL use relative routing paths.

#### Scenario: Clicking a feature design prototype link
- **WHEN** the engineer clicks a `code.html` reference
- **THEN** the link references `./code.html` instead of absolute directories containing `/home/nildiaz/`.

---

### Requirement: Database Schema Representation Accuracy
The documentation representing the database architecture SHALL accurately reflect the physical tables, column attributes, primary keys, and enums defined in the Drizzle schema code.

#### Scenario: Reading the ER diagrams
- **WHEN** the developer views the `database-schema.md`
- **THEN** the diagram includes the `passkey_credentials`, `groups`, `group_members`, `saved_locations`, and `offline_packages` tables.
