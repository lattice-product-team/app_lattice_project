## 1. Design System Foundation

- [x] 1.1 Update `apps/admin-web/src/app/globals.css` to refine `@theme` block with Eleven tokens
- [x] 1.2 Verify `Cormorant Garamond` (300) is correctly configured as the `waldenburg-display` fallback in `globals.css`
- [x] 1.3 Update `apps/admin-web/src/app/layout.tsx` to ensure proper font variable injection and background color inheritance
- [x] 1.4 Test `shadow-hairline` utility class against pure white and eggshell backgrounds

## 2. Global Layout Refactor

- [x] 2.1 Refactor `apps/admin-web/src/app/(admin)/layout.tsx` to ensure main content area uses Eleven ground rules
- [x] 2.2 Audit `SidebarNav` component to ensure all navigation items follow the Eleven pill-style and typography
- [x] 2.3 Standardize the "Sign Out" button style in the sidebar footer

## 3. Dashboard Implementation (Priority)

- [x] 3.1 Redesign the Dashboard header in `apps/admin-web/src/app/(admin)/page.tsx` using `waldenburg-display` and correct tracking
- [x] 3.2 Replace all standard `Card` components on the dashboard with the `.hairline-card` pattern
- [x] 3.3 Refactor the "Active Event Showcase" grid to use the Eleven editorial layout (Eggshell/White contrast)
- [x] 3.4 Implement the "Live" status pill using the Obsidian background and proper tracking
- [x] 3.5 Update all metric labels and values to use the reduced typography scale (14px/12px)

## 4. Operational Insights & Intelligence

- [x] 4.1 Implement the "Critical POI Monitor" component using the `usePOIs` hook
- [x] 4.2 Create the "Accessibility Health Index" visualization in the Monitoring Sidebar
- [x] 4.3 Add a "Gate Traffic" ranking list to the telemetry section
- [x] 4.4 Documentation: Update `docs/guides/design-system.mdx` with the new Admin Web Eleven standards
