## 1. Identity & Config Unification

- [x] 1.1 Update `scheme` to `"lattice"` in `apps/mobile/app.json`
- [x] 1.2 Update `bundleIdentifier` and `package` to `"com.cdc.lattice"` in `apps/mobile/app.json`
- [x] 1.3 Update app name in any remaining package files to `"Lattice"`

## 2. Code Sanitization

- [x] 2.1 Remove "Muzaic" references from `apps/mobile/app/(auth)/login.tsx`
- [x] 2.2 Remove "Muzaic" references from `apps/mobile/app/(auth)/register.tsx`
- [x] 2.3 Clean up redundant scripts in `apps/mobile/package.json` (remove `--go` leftovers)

## 3. Route Refactoring

- [x] 3.1 Move `apps/mobile/app/scan.tsx` to `apps/mobile/app/(main)/scan.tsx`
- [x] 3.2 Update navigation links to point to `/(main)/scan` instead of `/scan`
- [x] 3.3 Update `apps/mobile/app/_layout.tsx` Stack configuration to reflect the move
- [x] 3.4 Update `apps/mobile/app/(main)/_layout.tsx` to include the `scan` screen
