## 1. Shared Package Setup

- [x] 1.1 Create `packages/theme` directory structure.
- [x] 1.2 Initialize `packages/theme/package.json` with workspace metadata.
- [x] 1.3 Configure `packages/theme/tsconfig.json` for shared consumption.

## 2. Token Implementation

- [x] 2.1 Define Brand, Neutral, Semantic, and Category color constants in `packages/theme/colors.ts`.
- [x] 2.2 Define typography constants (Inter font family and size scale) in `packages/theme/typography.ts`.
- [x] 2.3 Create `packages/theme/index.ts` to export all tokens.
- [x] 2.4 Run a type-check in the package to ensure validity.

## 3. Documentation & Verification

- [x] 3.1 Update `docs/guides/design-system.md` with the refined Solar Gold palette.
- [x] 3.2 Add a "Migration Guide" section to the documentation explaining how to use `@app/theme` tokens in the future.
- [x] 3.3 Verify that the package is visible to `pnpm` by running `pnpm list -r`.

## 4. Dual-Theme Implementation (Light/Dark)

- [x] 4.1 Refactor `packages/theme/colors.ts` to support nested `light` and `dark` modes for `neutral` and `semantic` colors.
- [x] 4.2 Update `docs/guides/design-system.md` to document the Dual-Theme architecture and the new Light palette.
- [x] 4.3 Verify type-safety of the new nested structure in `packages/theme`.
