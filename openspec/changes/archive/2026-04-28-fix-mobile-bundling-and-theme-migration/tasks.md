## 1. Environment and Dependencies

- [x] 1.1 Add `@app/theme` dependency to `apps/mobile/package.json`.
- [x] 1.2 Run `pnpm install` in the root to link the new package to the mobile app.

## 2. Core Theme Migration

- [x] 2.1 Update `apps/mobile/src/styles/theme.ts` to import from `@app/theme` instead of local `./colors`.
- [x] 2.2 Re-map the new tokens from `@app/theme` to the `LatticeTheme` structure.
- [x] 2.3 Update `apps/mobile/src/styles/semanticColors.ts` to align with the new theme tokens.

## 3. Fixing Critical Errors and Imports

- [x] 3.1 Correct `useAuthStore` import paths in `ThemeGradient.tsx` and `telemetryService.ts`.
- [x] 3.2 Add missing `status: PermissionStatus` to `LocationState` interface in `useLocationStore.ts`.
- [x] 3.3 Fix `MapLibreGL.offlineManager.createPack` call in `offlineService.ts` by adding the missing error callback.
- [x] 3.4 Verify and fix `storage.delete` calls in `offlineService.ts` for MMKV compatibility.
- [x] 3.5 Update `ThemeGradient.tsx` to fully consume the theme via `useLatticeTheme()`.

## 4. Global Refactoring and Cleanup

- [x] 4.1 Search and replace all remaining imports of `../styles/colors` across the mobile app.
- [x] 4.2 Update components to use semantic theme tokens instead of primitive colors where appropriate.
- [x] 4.3 Delete the deprecated `apps/mobile/src/styles/colors.ts` file.
- [x] 4.4 Run `npx tsc --noEmit` in `apps/mobile` to ensure all 34+ type errors are resolved.

## 5. Final Validation

- [x] 5.1 Run `npm run dev` (or `npx expo start`) to verify that bundling no longer fails.
- [x] 5.2 Archive the change using `/opsx-archive`.
