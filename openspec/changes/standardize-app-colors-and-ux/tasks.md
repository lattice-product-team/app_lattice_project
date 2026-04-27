## 1. Refine Theme System

- [x] 1.1 Update `src/styles/colors.ts` with a complete, professional primitive palette (Solar, Midnight, Pristine, Slate, plus status colors).
- [x] 1.2 Expand `LatticeTheme` interface in `src/styles/theme.ts` to include `status` (success, warning, error, info) and `interactive` (pressed, disabled) token groups.
- [x] 1.3 Map new semantic tokens in both `lightTheme` and `darkTheme` objects.
- [x] 1.4 Refine `glass` tokens in `darkTheme` for a more premium "Midnight Glass" effect.

## 2. Component Migration: UI & Base

- [x] 2.1 Identify and replace hardcoded colors in `src/components/ui/` components (e.g., `PremiumButton.tsx`, `SettingItem.tsx`).
- [x] 2.2 Migrate base layout components and screens in `app/(main)/` to use the new theme tokens.

## 3. Component Migration: Map & POI

- [x] 3.1 Audit `src/components/map/` and replace all hex/rgba values (e.g., in `MapBottomSheet.tsx`, `QuickActions.tsx`, `SheetFooterActions.tsx`).
- [ ] 3.2 Audit `src/components/poi/` and `src/components/POICard.tsx` for hardcoded colors.
- [ ] 3.3 Update POI utility colors in `src/utils/poiUtils.ts` to use theme-aware color mapping.

## 4. Verification & Final Polish

- [ ] 4.1 Perform a full manual walkthrough of the mobile app in both light and dark modes to verify visual consistency.
- [ ] 4.2 Check color contrast on all text and interactive elements for accessibility compliance.
- [ ] 4.3 Formally deprecate and remove direct imports of the `colors` object from `src/styles/colors.ts` across the codebase.
