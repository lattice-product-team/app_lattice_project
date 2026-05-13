## Context

The Lattice project uses a Turborepo monorepo structure. Documentation is authored in `/docs` and synced to `apps/docs` for deployment via GitHub Pages. Currently, assets are referenced using absolute local paths from the AI environment, which fail in production. Emojis are used inconsistently across headers and navigations.

## Goals / Non-Goals

**Goals:**
- Move all documentation assets to `apps/docs/public/assets`.
- Ensure all Markdown/MDX files use relative public paths for images.
- Remove emojis from all headers, titles, and `_meta.ts` files.
- Update the root `README.md` to point to the live URL for all documentation links.

**Non-Goals:**
- Changing the site theme or styling (only content and paths).
- Renaming the GitHub repository (out of scope for this code change).

## Decisions

### 1. Asset Storage Strategy
**Decision:** Store all permanent documentation assets in `apps/docs/public/assets`.
**Rationale:** Next.js serves files in the `public` folder from the root `/`. This ensures that assets are accessible via predictable URLs like `/assets/banner.png` regardless of the page depth.
**Alternatives Considered:** Storing assets in the root `/docs` folder and copying them. Decision: It's cleaner to keep them in the app's `public` folder as they are specific to the web portal.

### 2. Relative vs. Absolute URLs in README
**Decision:** Use absolute production URLs (`https://...`) for links in the root `README.md`.
**Rationale:** The root `README.md` is primarily viewed on GitHub. Pointing to the live site provides the best experience for visitors.

### 3. Emoji Removal Pattern
**Decision:** Remove emojis from `#` headers, `_meta.ts` keys/values, and metadata.
**Rationale:** Establishes a professional, high-density editorial tone consistent with corporate engineering portals.

## Risks / Trade-offs

- **[Risk] Broken Links**: Manual link updates in README might lead to 404s if the structure changes.
  - **Mitigation**: Verify the URL structure against the current deployment before final commit.
- **[Risk] Missing Assets**: Some assets might be missed during migration.
  - **Mitigation**: Perform a global search for `![` and `<img` in the entire docs folder.
