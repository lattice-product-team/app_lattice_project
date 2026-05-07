## 1. Theme & Design Tokens

- [x] 1.1 Update `GlassBackground` and `GlassBorder` tokens in `apps/mobile/src/styles/theme.ts` to use high-opacity solid colors (0.9).
- [x] 1.2 Verify contrast ratios for primary and secondary text against the new solid backgrounds in both Light and Dark modes.

## 2. Event Detail Sheet Refactor

- [x] 2.1 Remove `SafeBlurView` from `apps/mobile/src/features/map/components/EventDetailSheet.tsx`.
- [x] 2.2 Update sheet background and header styles to use the new solid `GlassBackground` token.
- [x] 2.3 Standardize all header action circles and service icons to use the uniform solid-transparency formula.

## 3. POI Mini-Card Refactor

- [x] 3.1 Remove `SafeBlurView` from `apps/mobile/src/features/map/components/POIMiniCard.tsx`.
- [x] 3.2 Update mini-card background and close button to use the new solid transparency standard.

## 4. Main Map Discovery Refactor

- [x] 4.1 Remove `SafeBlurView` from the main Discovery Island in `apps/mobile/app/(main)/index.tsx`.
- [x] 4.2 Standardize the search experience header background to match the "Modern Solid" aesthetic.
- [x] 4.3 Verify that the search bar maintains its "Floating" feel without real-time blur.

## 5. Deep Cleanup (Remaining Components)

- [x] 5.1 Remove `SafeBlurView` from `apps/mobile/src/components/navigation/InstructionBanner.tsx`.
- [x] 5.2 Remove `SafeBlurView` from `apps/mobile/src/components/ui/AuthPromptSheet.tsx`.
- [x] 5.3 Remove `SafeBlurView` from `apps/mobile/src/components/ui/CategoryChip.tsx`.
- [x] 5.4 Remove `SafeBlurView` from `apps/mobile/src/features/map/components/NavigationInfo.tsx`.
- [x] 5.5 Remove `SafeBlurView` from `apps/mobile/src/features/map/components/RemoteModeWarning.tsx`.

## 6. Performance & Cleanup

- [x] 6.1 Perform a visual audit on Android to ensure no "white patches" or contrast issues remain.
- [x] 6.2 Deprecate and REMOVE `SafeBlurView.tsx` and `expo-blur` dependency.
