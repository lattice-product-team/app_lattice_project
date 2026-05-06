## Why

The recent migration to HeroUI v3 and Tailwind CSS v4 has introduced breaking changes in component APIs (specifically Tables) and styling inconsistencies. Additionally, the current dashboard UI uses excessively large font sizes for an administrative interface, lacks theme consistency in dark mode, and needs a more professional, scalable foundation for future features.

## What Changes

- **HeroUI v3 API Fixes**: Resolve `Table` component regressions (removing legacy `align` props and adding mandatory `isRowHeader`).
- **Typography Standardization**: Reduce global and component-level font sizes to professional admin standards (e.g., base 14px instead of 16px+, smaller headers).
- **Theme Refinement**: Fix Dark Mode contrast issues, ensuring white text and borders are handled semantically across both themes.
- **Style Consolidation**: Extract ad-hoc styles into a consistent design system (using Tailwind v4 theme variables) to ensure scalability across all admin pages.
- **Accessibility Improvements**: Fix ARIA warnings in HeroUI components.

## Capabilities

### New Capabilities
- `admin-design-system`: A standardized set of Tailwind v4 theme variables and components specifically for the administrative interface.

### Modified Capabilities
- `event-operations-dashboard`: Updating the requirement for the dashboard to use the new professional typography and HeroUI v3 table standards.
- `design-tokens`: Syncing admin-web specific tokens with the global design token system.

## Impact

- `apps/admin-web`: Primary impact on all pages and components.
- `apps/admin-web/src/app/globals.css`: Significant updates to the Tailwind v4 theme configuration.
- `apps/admin-web/package.json`: Potential addition of design-related utility packages.
