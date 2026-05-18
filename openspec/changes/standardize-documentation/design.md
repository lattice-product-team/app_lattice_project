## Context

The project documentation was recently cleared and needs a professional structure to support long-term growth and complex monorepo management. The current setup uses a domain-driven folder structure (`architecture`, `api-spec`, `engineering`, `guides`, `product`) and relies on `_meta.json` files for navigation, suggesting an MDX-based portal (like Nextra).

## Goals / Non-Goals

**Goals:**

- Establish a professional, scalable documentation hierarchy.
- Standardize technical decision tracking via ADRs.
- Document critical monorepo workflows and API standards.
- Ensure the documentation portal is easily navigable and maintainable.

**Non-Goals:**

- Completely rewriting the documentation portal's frontend code (only modifying content and structure).
- Generating API documentation automatically from code in this phase (manual/OpenAPI spec focused).

## Decisions

### 1. Standardized Folder Structure

We will strictly adhere to the five domains defined in the proposal. This prevents "documentation debt" where files are dumped into a single root folder.

- **Why**: Clarity and separation of concerns. Developers know exactly where to find/add technical specs vs. product vision.

### 2. Architectural Decision Records (ADR)

We will implement an ADR system in `docs/architecture/adr/`.

- **Why**: To preserve context for future developers. It prevents re-litigating old technical choices.
- **Alternative**: Using PR descriptions. Rejected because PRs are harder to search and aren't co-located with the code/docs.

### 3. Meta-Driven Navigation

We will maintain `_meta.json` files in every directory.

- **Why**: It decouples the filesystem order from the UI display order and allows for descriptive titles without renaming files.

### 4. Monorepo Workflow Documentation

We will prioritize documentation for `pnpm` and `Docker` in the `engineering` domain.

- **Why**: These are the most frequent friction points for new contributors in this specific codebase.

## Risks / Trade-offs

- **Risk: Stale Documentation** → **Mitigation**: Add a "Documentation Check" to the PR template and encourage updating docs alongside code changes.
- **Risk: Fragmented Information** → **Mitigation**: Use internal cross-linking between domains (e.g., a guide linking to an API spec).

## Open Questions

- Should we integrate mermaid.js for architecture diagrams immediately? (Assuming yes, as it fits the MDX pattern).
