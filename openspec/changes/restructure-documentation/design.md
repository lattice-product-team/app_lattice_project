## Context

The project documentation currently exists in a `docs/` directory with a custom structure. The user needs to migrate this to a 10-section structure mandated by instructors, using Markdown instead of the suggested PDF format where possible.

## Goals / Non-Goals

**Goals:**
- Implement a 10-section documentation structure in `/docs`.
- Map existing content from the old structure to the new sections.
- Provide a clear entry point in `README.md`.
- Ensure all required items (A-J) are accounted for.

**Non-Goals:**
- Creating the actual content for videos (G, J) or the full abstract/presentation content (A, F, H) unless existing content is available.
- Deleting the old structure until the migration is confirmed.

## Decisions

### Decision 1: Directory Structure
I will use a folder-based structure for all 10 sections in `/docs` using English lowercase names and letter prefixes (a-j). Each folder will contain a `README.md`.

**Rationale:** Folders provide better organization for multiple assets (images, PDFs, code snippets) and satisfy the user's preference for future-proofing.

### Decision 2: Mapping of Existing Content
- `docs/apis/` and `docs/architecture/` -> `docs/e-technical-documentation/`.
- `docs/guides/setup.md` and `deployment.md` -> `docs/d-source-code/`.
- `docs/guides/testing.md` -> `docs/b-planning/`.
- `docs/product/user-journeys.md` -> `docs/f-functional-commercial-presentation/` or `docs/i-user-manual/`.

### Decision 3: PDF vs MD
For sections A, F, and H (which the template suggests as PDF), I will create `.md` files that can be easily exported to PDF if needed, but serve as the source of truth in the repository.

## Risks / Trade-offs

- [Risk] Broken links in existing documentation → [Mitigation] Audit and update all internal links during migration.
- [Risk] Conflict with existing `docs/` content → [Mitigation] Move existing content to a `docs/archive` folder temporarily.

## Migration Plan

1. Create the new 10 `.md` files in `/docs`.
2. Populate the files by referencing or moving content from the current `docs/` subdirectories.
3. Update root `README.md` with the new Table of Contents.
4. Move remaining old documentation to `docs/.archive/` or delete if fully migrated.
