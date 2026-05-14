## 1. Setup and Infrastructure

- [x] 1.1 Install `next-themes` dependency in `apps/admin-web`.
- [x] 1.2 Update `apps/admin-web/src/app/providers.tsx` to include `ThemeProvider` with `attribute="class"` and `defaultTheme="system"`.
- [x] 1.3 Update `apps/admin-web/src/app/layout.tsx` to remove the hardcoded `light` class from the `<html>` tag and add `suppressHydrationWarning`.

## 2. Theme Toggle UI

- [x] 2.1 Add `Sun` and `Moon` SVG icons to `apps/admin-web/src/components/icons.tsx`.
- [x] 2.2 Create a `ThemeToggle` component in `apps/admin-web/src/components/command-center/ThemeToggle.tsx` with animated transitions.
- [x] 2.3 Integrate `ThemeToggle` into the footer of `apps/admin-web/src/components/command-center/Sidebar.tsx`, positioned at the bottom-left.

## 3. Map Theme Synchronization

- [x] 3.1 Refactor `MAP_STYLE` constant in `AdminMap.tsx` into `MAP_STYLE_LIGHT` and `MAP_STYLE_DARK` variants.
- [x] 3.2 Implement dynamic style selection logic using `resolvedTheme` within the `AdminMap` component.
- [x] 3.3 Refine map layer `paint` properties (e.g., `text-halo-color`) in `AdminMap.tsx` to ensure visibility across both themes.

## 4. Styling and Variable Audit

- [x] 4.1 Audit `apps/admin-web/src/app/globals.css` to ensure all core semantic variables (background, foreground, surface, border) have high-quality dark mode mappings.
- [x] 4.2 Fix any hardcoded light-colored elements that don't transition correctly (e.g., `admin-table-container` backgrounds).

## 5. Verification

- [ ] 5.1 Verify that the application correctly detects and applies the system theme on cold load.
- [ ] 5.2 Verify that the manual toggle correctly overrides the theme and persists across sessions.
- [ ] 5.3 Verify that the map style switches automatically when the theme is toggled.
- [ ] 5.4 Confirm the absence of hydration mismatches or layout shifts during theme initialization.
