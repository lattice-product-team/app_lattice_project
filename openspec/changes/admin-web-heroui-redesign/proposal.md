## Why

The current `admin-web` styling is built on a fragmented Tailwind CSS implementation with hardcoded colors and manual layout components. To achieve a professional, scalable, and unified aesthetic, we need to transition to a modern component framework (**HeroUI v3**) and fully integrate our newly established **Solar Gold** palette and **Inter** typography.

## What Changes

- **Framework Migration**: Replace manual Tailwind CSS layouts with **HeroUI v3** components.
- **Color Integration**: Map the `@app/theme` Solar Gold tokens to HeroUI's semantic CSS variables using OKLCH.
- **Typography Shift**: Enforce **Inter** as the primary typeface across the Admin Web interface.
- **Layout Redesign**: Implement a new sidebar and navigation structure using HeroUI components.
- **Component Standardization**: Replace custom "glass-card" and red-themed buttons with HeroUI's standard surfaces and buttons.

## Capabilities

### New Capabilities
- `admin-ui-modernization`: Implementation of HeroUI v3 and refined design standards within the Admin Web application.

### Modified Capabilities
- `design-tokens`: Update requirements to include HeroUI-specific mappings (OKLCH) for all brand and semantic colors.

## Impact

- **`apps/admin-web`**: Significant refactor of the layout, globals.css, and page components.
- **`packages/theme`**: Potential expansion to include OKLCH helper values.
- **Documentation**: Updates to `docs/guides/design-system.md` to reflect the HeroUI implementation.
