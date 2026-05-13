## 1. Asset Migration & Link Fixes

- [x] 1.1 Create `apps/docs/public/assets` directory.
- [x] 1.2 Move all generated documentation images (banners, mockups) to `apps/docs/public/assets`.
- [x] 1.3 Perform a global search and replace in all `.md` and `.mdx` files to update local image paths to `/assets/` paths.
- [x] 1.4 Update root `README.md` image references to use the live production URL or relative public path.

## 2. Professional Tone Refinement (Emoji Removal)

- [x] 2.1 Remove emojis from all `#` headers in all Markdown files within `/docs`.
- [x] 2.2 Clean up `_meta.ts` files (root and subdirectories) to remove emojis from navigation titles.
- [x] 2.3 Remove emojis from the root `README.md` headers.

## 3. README Navigation Update

- [x] 3.1 Identify all documentation links in the root `README.md` (e.g., `[Product](./docs/product)`).
- [x] 3.2 Update these links to point to the live URL: `https://lattice-product-team.github.io/app_lattice_project/<path>`.
- [x] 3.3 Verify all links point to the correct production routes.

## 4. Admonition Migration (Callouts)

- [x] 4.1 Identify all GitHub-style admonitions (`> [!TIP]`, `> [!IMPORTANT]`, `> [!WARNING]`, `> [!CAUTION]`, `> [!NOTE]`).
- [x] 4.2 Replace them with Nextra's `<Callout>` component in all MDX files.
- [x] 4.3 Ensure `import { Callout } from 'nextra/components'` is added to MDX files using callouts (or handled globally if possible).

## 5. Verification & Sync

- [x] 5.1 Run `./sync-docs.sh` to ensure all changes are propagated to `apps/docs/pages`.
- [x] 5.2 Run `pnpm --filter docs build` locally to verify the build succeeds and types are valid.
- [x] 5.3 Verify that images and callouts load correctly in the local dev server (`pnpm --filter docs dev`).
