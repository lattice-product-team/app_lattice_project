## 1. Documentation & Shared Alignment

- [x] 1.1 Update `@app/types-schema` coordinate order to `[longitude, latitude]` and fix comments.
- [x] 1.2 Translate `docs/apis/api-contract.md` to English.
- [x] 1.3 Translate `docs/product/system-prompt.md` to English.

## 2. Mobile Map Refactor (MapContent.tsx)

- [x] 2.1 Refactor iOS rendering: Replace individual `MarkerView` with a native `SymbolLayer`.
- [x] 2.2 Extract `NavigationController` logic into a new hook or separate service.
- [x] 2.3 Migrate `StyleSheet` and inline styles to NativeWind classes.
- [x] 2.4 Replace hardcoded hex colors with design tokens from `colors.ts`.

## 3. Verification

- [x] 3.1 Run mobile unit tests to ensure no regressions.
- [x] 3.2 Perform a quick code audit to ensure all Catalan comments/docs are gone.

