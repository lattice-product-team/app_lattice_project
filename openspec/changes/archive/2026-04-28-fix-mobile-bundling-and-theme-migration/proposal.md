## Why

The mobile app development environment is currently unstable due to broken import paths after recent merges and a mismatch between local design tokens and the new shared theme package. Fixing these issues is critical to restore bundling capabilities and ensure design consistency across the monorepo.

## What Changes

- **Fix Broken Imports**: Correct `useAuthStore` import paths that were broken during refactoring.
- **Theme Migration**: Migrate the mobile app's theme system to use the new shared `@app/theme` package.
- **Clean Up**: Remove the local `apps/mobile/src/styles/colors.ts` and update all components to use the new theme tokens.
- **Type Safety**: Resolve 34+ TypeScript errors across the mobile app related to store interfaces and service API changes.

## Capabilities

### New Capabilities

- `mobile-bundling-integrity`: Ensuring the mobile application correctly resolves all internal and shared dependencies for successful Metro bundling.
- `shared-theme-integration`: Ensuring all mobile UI components consume design tokens exclusively from the `@app/theme` package.

### Modified Capabilities

<!-- No requirement changes to existing capabilities, only implementation fixes. -->

## Impact

- **Mobile App**: Restoration of bundling (Metro) and functional development environment.
- **Theme System**: Centralization of design tokens in `@app/theme`.
- **Developer Experience**: Improved type safety and reduced duplication.
