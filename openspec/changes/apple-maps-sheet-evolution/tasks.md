## 1. MapBottomSheet Refactor (Main)

- [x] 1.1 Extract Search Bar and Filters from `BottomSheetScrollView` in `MapBottomSheet.tsx` to create a fixed header.
- [x] 1.2 Implement absolute or flex-fixed positioning for the search interface inside the sheet container.
- [x] 1.3 Adjust snap points to [110, SCREEN_HEIGHT * 0.48, SCREEN_HEIGHT * 0.92] for consistent Apple-style height ratios.
- [x] 1.4 Integrate `expo-haptics` (`impactAsync`) within the `onChange` callback to trigger on snap completion.

## 2. PoiDetailSheet Refactor (Detail)

- [x] 2.1 Separate `poiHeader` and the primary `actionRow` from the `BottomSheetScrollView` in `PoiDetailSheet.tsx`.
- [x] 2.2 Reconstruct the internal layout to ensure the Title and "IR AHORA" actions remain persistently accessible.
- [x] 2.3 Update `CustomBackground` with a 0.5px "inner glow" border (`rgba(255,255,255,0.15)`) for the Midnight Glass look.
- [x] 2.4 Add haptic feedback pulse on state transitions to match the main sheet's tactile feel.

## 3. Orchestration & Polish

- [ ] 3.1 Verify sticky header behavior and scroll padding across both light and dark themes.
- [ ] 3.2 Ensure the `MapSheetManager.tsx` correctly handles transitions between the refactored sheets without jitter.
- [ ] 3.3 Test haptic feedback on a physical device (if possible) or verify the logic in the code.
