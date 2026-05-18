## 1. Path & Directory Sanitization

- [x] 1.1 Scan and replace all hardcoded absolute `file:///home/nildiaz/app_lattice_project/` paths in `activity-diagram.md` and `docs/product/features-design/*/index.md` with clean relative paths.
- [x] 1.2 Move all specification Markdown content and images from the duplicate `_&_` product directories (e.g. `circuit_map_&_search`) into their URL-safe `_and_` counterparts (e.g. `circuit_map_and_search`).
- [x] 1.3 Delete the redundant, empty `_&_` folders from the filesystem under `docs/product/features-design/`.
- [x] 1.4 Update all design navigation links on the main product design [index page](file:///Users/kore/Documents/Code/Projects/app_lattice_project/docs/product/features-design/index.md) to point to the correct, URL-safe `_and_` directories.

## 2. Developer Guides & Command Modernization

- [x] 2.1 Rewrite [getting-started.md](file:///Users/kore/Documents/Code/Projects/app_lattice_project/docs/guides/getting-started.md) to use correct root-level monorepo commands (`pnpm db:migrate`, `pnpm db:seed`, `pnpm dev:api`, `pnpm dev:web`, `pnpm dev:mobile`) instead of the non-existent package filters.
- [x] 2.2 Document the standard `pnpm dev:mobile:lan` and `pnpm dev:mobile:lan:prod` flows in the mobile setup guidelines.
- [x] 2.3 Correct the database port to `5433` in [troubleshooting.md](file:///Users/kore/Documents/Code/Projects/app_lattice_project/docs/guides/troubleshooting.md) and align package filter commands to root scripts.
- [x] 2.4 Fix the broken light/dark nested icon image references on [tech-stack.md](file:///Users/kore/Documents/Code/Projects/app_lattice_project/docs/engineering/tech-stack.md) by pointing them directly to the flat SVGs under `public/img`.

## 3. Database & API Schema Alignment

- [x] 3.1 Update the ER diagrams and documentation in [database-schema.md](file:///Users/kore/Documents/Code/Projects/app_lattice_project/docs/architecture/database-schema.md) to include the missing tables: `passkey_credentials`, `groups`, `group_members`, `saved_locations`, and `offline_packages`.
- [x] 3.2 Align table primary keys (composite keys on `group_members` and string IDs on `passkey_credentials`) and fields (removing unused telemetry speed/bearing) to match Drizzle `schema.ts`.
- [x] 3.3 Synchronize POI and mobility mode enums in [schemas.md](file:///Users/kore/Documents/Code/Projects/app_lattice_project/docs/api-spec/schemas.md) to accurately represent their Drizzle code equivalents.

## 4. Synchronization Verification

- [x] 4.1 Execute `sync-docs.sh` manually from `apps/docs/` to compile all new Markdown updates into Nextra MDX files.
- [x] 4.2 Run/restart `pnpm dev:docs` and verify that the local documentation site loads flawlessly, with all diagrams and links rendering in perfect, minimal, light-mode compatible style.
