## 1. Component Standardization

- [x] 1.1 Update `apps/admin-web/src/components/ui/input.tsx` to enforce `rounded-none` and `bg-powder/40` as the default styling for the `contained` variant.
- [x] 1.2 Ensure `apps/admin-web/src/components/ui/button.tsx` uses `shadow-subtle-2` for the primary variant and audit existing usages.
- [x] 1.3 Verify and refine the `shadow-massive` token in `apps/admin-web/src/app/globals.css` to ensure it provides sufficient depth for high-importance overlays.

## 2. Login Page Overhaul

- [x] 2.1 Remove decorative `blur-3xl` circles and background gradients from `apps/admin-web/src/app/(auth)/login/page.tsx`.
- [x] 2.2 Redesign the Login card: Apply `bg-white/80`, `backdrop-blur-md`, `border-chalk`, and `shadow-massive`.
- [x] 2.3 Align Login page typography: Apply `waldenburg-display` to the "Operations Center" header and use `text-[10px] font-black uppercase tracking-widest text-gravel` for all form labels.
- [x] 2.4 Update the "Authenticate" button to follow the standardized primary button style with appropriate tracking and weighting.

## 3. Global Layout and Polish

- [x] 3.1 Audit `apps/admin-web/src/app/(admin)/layout.tsx` to ensure the floating navigation and safe area variables maintain the technical "canvas" feel.
- [x] 3.2 Perform a typography sweep across all `(admin)` pages to ensure consistent use of `waldenburg-display` for section headers.
- [x] 3.3 Ensure all "Technical Metadata" labels use the standardized uppercase tracking style.
- [x] 3.4 Fix logout button functionality in `FloatingLogout` while preserving its rounded style and transition effects.

## 4. Verification

- [x] 4.1 Visually verify that the Login page aesthetic matches the high-fidelity style of the Events and POIs screens.
- [x] 4.2 Confirm that component standardization does not introduce regressions in existing "Events" and "POIs" layouts.
- [x] 4.3 Run a functional test of the Login form to ensure stylistic changes haven't affected the form submission or error state handling.
