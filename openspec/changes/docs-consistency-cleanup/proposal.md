## Why

There is currently a significant mismatch between the real codebase configuration (Drizzle schemas, monorepo dev scripts, and public assets) and the documentation files under `/docs/`. This leads to broken image links on the tech stack page, non-functional links containing absolute paths of a previous developer's directory, duplicate product specification folders, and outdated developer instructions that crash when executed. 

Aligning the documentation to match the real workspace is critical to maintaining a polished, professional engineering portal and providing an impeccable developer onboarding experience.

## What Changes

*   **Path Sanitization**: Replace all hardcoded absolute `file:///home/nildiaz/app_lattice_project/` paths in `activity-diagram.md` and product specifications with relative links.
*   **Nextra URL Alignment & Consolidation**: Consolidate duplicate feature folders under `docs/product/features-design/` (moving specification contents from illegal `_&_` URL characters to clean, safe `_and_` directories) and update the main feature index page.
*   **Modernize Developer Guides**: Rewrite `getting-started.md` and update `troubleshooting.md` to use the correct workspace package filters and scripts defined in the root `package.json` (`pnpm dev:api`, `pnpm dev:web`, `pnpm dev:mobile`, `pnpm dev:mobile:lan`, `pnpm dev:mobile:lan:prod`).
*   **Database Schema Alignment**: Update `database-schema.md` and `schemas.md` to document the 4 missing core Postgres tables (`passkey_credentials`, `groups`, `group_members`, `saved_locations`, `offline_packages`) and correct the field type conflicts (e.g., passkey ID type, group member primary keys, and telemetry bearing fields).
*   **Asset Fixes**: Resolve broken light/dark SVGs in `tech-stack.md` by pointing to flat, unified icons in `public/img/`.

## Capabilities

### New Capabilities
*No new system capabilities are introduced. This is a pure documentation, layout, and command alignment task.*

### Modified Capabilities
*No existing system requirements are changed.*

## Impact

*   **Documentation Site**: Updates to Markdown/MDX files under `docs/` and their respective synced targets in `apps/docs/pages/` (compiled via `sync-docs.sh`).
*   **Developer Onboarding**: Ensures an immediate, seamless local launch experience with correct scripts and fully functional local links.
