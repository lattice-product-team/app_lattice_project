## Why

The current documentation portal has residual visual inconsistencies (emojis in a professional context), broken image links due to local path references, and navigation links in the root README that point to internal files instead of the live production site. These issues undermine the perceived quality and accessibility of the project for stakeholders and contributors.

## What Changes

- **Visual Tone**: Removal of emojis from all technical documentation to establish a sober, professional corporate tone.
- **Asset Portability**: Migration of generated visual assets (banners, mockups) to the documentation's public directory to ensure they render correctly in the deployed site.
- **SSOT Navigation**: Redirection of all README navigation links to the live production URL (`https://lattice-product-team.github.io/app_lattice_project/`) to provide a seamless user experience.
- **Environment Alignment**: Refinement of the build and sync scripts to handle the new asset structure.

## Capabilities

### New Capabilities

- `documentation-asset-management`: Defines the strategy for managing, hosting, and referencing visual assets within the Turborepo documentation app.
- `pro-documentation-standards`: Establishes the professional tone, formatting (MDX strictness), and link persistence standards for the project.

### Modified Capabilities

- `standards-alignment`: Inclusion of documentation style guidelines (no emojis) and asset linking requirements.
- `ci-cd-standards`: Updates to the documentation deployment flow to handle static asset persistence.

## Impact

- **Root README**: Updated links and image paths.
- **Docs App**: New directory structure in `apps/docs/public/` and updated MDX files.
- **Sync Scripts**: Modifications to `sync-docs.sh` to handle asset copying.
- **Metadata**: Updates to `_meta.ts` files to reflect the professional tone.
