## Context

The `admin-web` interface is designed as a "canvas" system where the main content is wrapped in a fixed-height layout. Navigation elements (`FloatingNav`, `FloatingLogout`) are positioned using `fixed`, causing them to float over the content. Currently, there is no top margin in the content area to account for these floating elements, and the data management toolbars in the Events and POIs pages are built with rigid flexbox structures that break on smaller viewports.

## Goals / Non-Goals

**Goals:**
- Implement a responsive "safe-area" for all admin pages.
- Group or reposition fixed navigation elements on mobile to prevent overlap.
- Make Events/POIs toolbars fluid and accessible on mobile.
- Maintain the achromatic, high-contrast aesthetic of the project.

**Non-Goals:**
- Redesigning the core navigation UX (keeping the "floating" concept).
- Adding a sidebar for mobile.
- Changing the existing data fetching or logic.

## Decisions

### 1. Dynamic Safe-Area Padding
We will introduce a CSS variable `--admin-safe-area` in `globals.css` and apply it as `padding-top` to the `main` container in `AdminLayout`.
- **Rationale**: This allows specific pages (like the full-screen Map) to override the padding if they need to be truly flush with the top, while providing a safe default for table-based pages.

### 2. Navigation Repositioning
- `FloatingLogout`: On screens `< 640px` (sm), it will move from `top-8 left-12` to a more accessible bottom corner or compact grouping.
- `FloatingNav`: We will reduce the horizontal padding of nav items on mobile to keep the bar compact and prevent it from hitting the screen edges.

### 3. Responsive Toolbar Refactor
The toolbars in `events/page.tsx` and `pois/page.tsx` will be refactored:
- Change `flex items-center` to `flex flex-col lg:flex-row`.
- Replace `divide-x` with `divide-y lg:divide-x lg:divide-y-0`.
- Ensure the Search input takes full width on mobile.

### 4. Table Wrapper
Wrap all `<table>` elements in a `div` with `overflow-x-auto` and `scrollbar-hide` to ensure the layout remains stable even with many columns.

## Risks / Trade-offs

- **[Risk]**: The `pt-32` might feel too large on some desktop screens. 
  - **Mitigation**: Use a responsive scale (e.g., `pt-20 lg:pt-32`).
- **[Risk]**: HeroUI components (`Select`, `ListBox`) might have internal styles that resist full-width expansion.
  - **Mitigation**: Use `classNames` prop to force `w-full` on the trigger and popover containers.
