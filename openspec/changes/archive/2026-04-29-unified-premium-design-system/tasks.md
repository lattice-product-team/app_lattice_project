## 1. Style Layer Refactor

- [x] 1.1 Update `colors.ts` with complete primitive set (Light & Midnight)
- [x] 1.2 Implement semantic token structure in `theme.ts`
- [x] 1.3 Add TypeScript interfaces for the unified theme
- [x] 1.4 Refactor `semanticColors.ts` to use theme factory pattern

## 2. Component Migration

- [x] 2.1 Update `PremiumButton` to use semantic tokens for all variants
- [x] 2.2 Refactor `FloatingSearchBar` to consume `Midnight Glass` tokens
- [x] 2.3 Update `MapBottomSheet` background to use theme-aware blur
- [x] 2.4 Verify all typography constants are theme-compatible

## 3. Global Integration & Verification

- [x] 3.1 Switch default app theme to Midnight in root provider/styles
- [x] 3.2 Verify visual consistency between Auth and Map screens
- [x] 3.3 Audit all remaining hardcoded color references (`#FFF`, `#000`)
- [x] 3.4 Run full mobile test suite to ensure style stability
