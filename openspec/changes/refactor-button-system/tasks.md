## 1. Setup and Preparation

- [ ] 1.1 Verify brand color tokens in `apps/mobile/src/styles/theme.ts`
- [ ] 1.2 Define new button variant tokens in the theme (if needed)

## 2. Component Implementation

- [ ] 2.1 Create new `Button` component in `apps/mobile/src/components/ui/Button.tsx`
- [ ] 2.2 Implement `primary`, `subdued`, `tertiary`, and `ghost` variants
- [ ] 2.3 Add support for left/right icons
- [ ] 2.4 Implement press animations (scale, opacity) and haptic feedback
- [ ] 2.5 Ensure full accessibility and RTL support

## 3. Migration

- [ ] 3.1 Replace `PremiumButton` with `Button` in `apps/mobile/src/components/ui/AuthPromptSheet.tsx`
- [ ] 3.2 Replace `PremiumButton` with `Button` in any other identified files
- [ ] 3.3 Update imports and variant mappings globally

## 4. Cleanup

- [ ] 4.1 Delete `apps/mobile/src/components/ui/PremiumButton.tsx`
- [ ] 4.2 Rename or refactor `PremiumSheetHeader.tsx` if it depends on the "Premium" naming convention
- [ ] 4.3 Verify all button interactions in the mobile app
