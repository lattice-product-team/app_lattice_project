## 1. Core Setup

- [x] 1.1 Install HeroUI packages (`@heroui/react`, `@heroui/styles`) in `apps/admin-web`.
- [x] 1.2 Link `@app/theme` package as a dependency in `apps/admin-web/package.json`.
- [x] 1.3 Create `apps/admin-web/src/components/providers.tsx` with `HeroUIProvider`.
- [x] 1.4 Wrap `RootLayout` in `apps/admin-web/src/app/layout.tsx` with the new `Providers`.

## 2. Global Styling & Theme Integration

- [x] 2.1 Update `apps/admin-web/src/app/globals.css` to import `@heroui/styles`.
- [x] 2.2 Configure OKLCH variables using the imported `colors` from `@app/theme`.
- [x] 2.3 Refactor `layout.tsx` to use `next/font/google` for **Inter** instead of Lexend.
- [x] 2.4 Update the `tailwindcss` theme block in `globals.css` to support HeroUI variables.

## 3. Layout Refactoring

- [x] 3.1 Replace the hardcoded `aside` sidebar with a structured HeroUI navigation component.
- [x] 3.2 Implement the "Hybrid" aesthetic (translucent Sidebar, opaque Main Content).
- [x] 3.3 Update the User Profile/Status section in the sidebar using HeroUI avatars.

## 4. Component Migration

- [x] 4.1 Update `apps/admin-web/src/app/venues/page.tsx` to use HeroUI `<Button>` and `<Card>`.
- [x] 4.2 Replace all "F1 Red" classes with HeroUI semantic `accent` color.
- [x] 4.3 Update the Map Editor and Radar containers to use HeroUI surface standards.
- [ ] 4.4 Verify the final redesign by running `npm run build` in `apps/admin-web`.
