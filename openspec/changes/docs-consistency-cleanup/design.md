## Context

Our documentation workspace has drifted from the actual monorepo layout and implementation. In particular, we have duplicate folders with unsafe URL characters (`_&_` vs `_and_`), outdated developer launch commands (referencing invalid package filters), hardcoded absolute paths, broken SVG assets, and missing database tables. This design defines a clean strategy to align all documentation files without affecting any runtime application code.

## Goals / Non-Goals

**Goals:**
*   **Aesthetic Uniformity**: Ensure all diagrams, assets, and folders render beautifully on the documentation site without broken assets.
*   **Onboarding Accuracy**: Align all developer guides (`getting-started.md`, `installation.md`, `troubleshooting.md`) with the correct, tested `package.json` scripts and Docker ports.
*   **Geospatial and Schema Consistency**: Align `database-schema.md` and `schemas.md` to match the exact active fields, composite primary keys, and enums in `schema.ts`.
*   **URL Safety**: Migrate all `_&_` directories to URL-friendly `_and_` directories to prevent browser route parameter delimiters from breaking.

**Non-Goals:**
*   Altering any database schemas, TypeScript code, or server business logic. This is a pure documentation, configuration, and layout alignment.
*   Adding new UI components or interactive widgets.

## Decisions

### 1. URL Path Safety (Consolidating `_&_` into `_and_`)
*   **Decision**: Move the actual specification Markdown files out of directories containing `_&_` (e.g. `circuit_map_&_search`) and place them directly into their counterpart `_and_` folders (e.g. `circuit_map_and_search`).
*   **Rationale**: The ampersand character (`&`) is a reserved URL query parameter separator. If a Nextra/Next.js page URL contains `&`, the router fails or treats subsequent characters as query parameters. Moving to `_and_` solves this natively.
*   **Alternatives Considered**: URL encoding the `&` as `%26`. However, this leads to ugly, non-human-readable URLs in the browser address bar (e.g. `/circuit_map_%26_search`) and frequently breaks static site generators.

### 2. Relative Link Sanitization
*   **Decision**: Scan and replace all hardcoded absolute `file:///home/nildiaz/app_lattice_project/` paths with relative paths (`./` or `../`).
*   **Rationale**: Relative paths resolve perfectly across all development machines (Mac, Linux) and in cloud CI/CD environments.

### 3. Modernize Developer Commands
*   **Decision**: Replace all outdated filter commands in `getting-started.md` and `troubleshooting.md` with unified root-level scripts:
  * `pnpm --filter server dev` ➡️ `pnpm dev:api`
  * `pnpm --filter mobile start` ➡️ `pnpm dev:mobile`
  * `pnpm --filter @app/db db:migrate` ➡️ `pnpm db:migrate`
  * `pnpm --filter @app/db db:seed` ➡️ `pnpm db:seed`
  * Document `pnpm dev:mobile:lan` and `pnpm dev:mobile:lan:prod` as the primary development flows.
*   **Rationale**: These are the correct, tested scripts in the root `package.json` that developers actually use.

### 4. Database Schema Correction
*   **Decision**: Update `database-schema.md` to:
  * Include the `passkey_credentials`, `groups`, `group_members`, `saved_locations`, and `offline_packages` tables.
  * Correct `PASSKEY_CREDENTIAL.id` to represent the string credential ID itself (not separate).
  * Update `GROUP_MEMBER` to show a composite primary key instead of a single PK.
  * Remove `speed` and `bearing` from `TELEMETRY_LOG` to match `schema.ts`.

## Risks / Trade-offs

*   **Risk**: Nextra dev server caching during the docs rewrite.
    *   *Mitigation*: We will instruct the developer to restart the Nextra server (`pnpm dev:docs`) to force a clean re-synchronization once all edits are completed.
