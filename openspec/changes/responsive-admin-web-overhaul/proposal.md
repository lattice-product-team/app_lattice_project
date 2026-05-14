## Why

The `admin-web` currently lacks responsiveness, leading to UI collisions on smaller screens and tablets. Specifically, the fixed navigation elements overlap with page titles, and data-heavy toolbars/tables overflow their containers. Fixing this ensures a professional, multi-device management experience while maintaining the project's strict achromatic aesthetic.

## What Changes

- **Global Safe-Area**: Introduce a consistent padding-top in the `AdminLayout` to prevent navigation overlap with page content.
- **Responsive Navigation**: Adapt `FloatingNav` and `FloatingLogout` to be more compact or grouped on mobile devices.
- **Fluid Toolbars**: Refactor the search and filter bars in Events and POIs pages to stack vertically on mobile while remaining horizontal on desktop.
- **Refined Table Containers**: Ensure all administrative tables handle horizontal overflow gracefully within the grid system.

## Capabilities

### New Capabilities
- `responsive-admin-layout`: Orchestrates the layout-wide responsiveness and safe-area margins for the admin interface.
- `fluid-toolbar-system`: Provides a standardized, responsive framework for search, filters, and actions across all admin data views.

### Modified Capabilities
<!-- No requirement changes to existing capabilities, this is a UI/UX refinement. -->

## Impact

- **Affected Layouts**: `apps/admin-web/src/app/(admin)/layout.tsx`
- **Affected Components**: `apps/admin-web/src/components/floating-nav.tsx`, toolbars within `apps/admin-web/src/app/(admin)/events/page.tsx` and `apps/admin-web/src/app/(admin)/pois/page.tsx`.
- **Styling**: `apps/admin-web/src/app/globals.css`
