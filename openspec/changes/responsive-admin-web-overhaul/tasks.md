## 1. Global Layout & Foundation

- [x] 1.1 Define `--admin-safe-area` CSS variable in `apps/admin-web/src/app/globals.css` with responsive values.
- [x] 1.2 Update `AdminLayout` in `apps/admin-web/src/app/(admin)/layout.tsx` to apply safe-area padding to the `main` content area.
- [x] 1.3 Add a global table wrapper style to `globals.css` to handle horizontal scrolling consistently.

## 2. Responsive Navigation

- [x] 2.1 Update `FloatingLogout` in `apps/admin-web/src/components/floating-nav.tsx` to reposition to the bottom-left or group on mobile viewports.
- [x] 2.2 Refactor `FloatingNav` in `apps/admin-web/src/components/floating-nav.tsx` to reduce item padding and scale on mobile.

## 3. Fluid Data Management (Events)

- [x] 3.1 Refactor the toolbar in `apps/admin-web/src/app/(admin)/events/page.tsx` to use vertical stacking and responsive dividers.
- [x] 3.2 Ensure the HeroUI `Select` components in the Events toolbar use full width on mobile.
- [x] 3.3 Wrap the Events table in a scroll-containment `div` with horizontal overflow enabled.

## 4. Fluid Data Management (POIs)

- [x] 4.1 Refactor the toolbar in `apps/admin-web/src/app/(admin)/pois/page.tsx` to use vertical stacking and responsive dividers.
- [x] 4.2 Ensure the HeroUI `Select` components in the POIs toolbar use full width on mobile.
- [x] 4.3 Wrap the POIs table in a scroll-containment `div` with horizontal overflow enabled.

## 5. Verification & Polish

- [x] 5.1 Verify that the Global Map page (`apps/admin-web/src/app/(admin)/page.tsx`) correctly overrides or handles the safe-area padding.
- [x] 5.2 Audit all admin pages on mobile (375px), tablet (768px), and desktop (1440px) breakpoints.
- [x] 5.3 Ensure the achromatic aesthetic is preserved without unwanted white borders or layout shifts.
