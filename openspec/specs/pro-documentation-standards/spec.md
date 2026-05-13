# pro-documentation-standards Specification

## Purpose
TBD - created by archiving change refine-docs-and-branding. Update Purpose after archive.
## Requirements
### Requirement: Documentation Visual Tone
All technical documentation (Markdown, MDX, and Meta configuration files) MUST adhere to a professional, high-density editorial tone. This requires the absolute removal of emojis from headers, titles, and navigation labels.

#### Scenario: Professional Header
- **WHEN** a developer views an MDX file or the live portal
- **THEN** all `<h1>` through `<h6>` tags MUST NOT contain emojis.

#### Scenario: Clean Navigation
- **WHEN** a user navigates the portal via the sidebar
- **THEN** all menu items (sourced from `_meta.ts`) MUST contain only alphanumeric text and standard punctuation.

### Requirement: Documentation Asset Persistence
All visual assets (banners, mockups, screenshots) used in the documentation portal MUST be stored within the `apps/docs/public/assets` directory. References to these assets MUST use relative public paths (e.g., `/assets/image.png`) to ensure they render correctly in production environments.

#### Scenario: Production Image Rendering
- **WHEN** the documentation is deployed to GitHub Pages
- **THEN** all images MUST load successfully via the `/assets/` prefix, independent of the local file system structure.

### Requirement: README-to-Portal Synchronization
The root `README.md` MUST serve as a high-level gateway to the live documentation portal. All internal navigation links within the README MUST point to the corresponding live production URLs instead of local file paths.

#### Scenario: Seamless User Redirection
- **WHEN** a visitor clicks a "Product" link in the root README on GitHub
- **THEN** the browser MUST redirect to `https://lattice-product-team.github.io/app_lattice_project/product`.

