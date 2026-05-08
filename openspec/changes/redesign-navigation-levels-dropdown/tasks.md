## 1. Core Layout Migration

- [x] 1.1 Update `islandContainer` in `apps/mobile/app/(main)/index.tsx` to use `top: 0` instead of `bottom: 0`.
- [x] 1.2 Reconfigure `islandStyle` to use `top` instead of `bottom` relative to `insets.top`.
- [x] 1.3 Invert border radius logic: apply 32px to `borderBottomLeftRadius` and `borderBottomRightRadius` for the floating card effect.
- [x] 1.4 Move the `handleContainer` (drag handle) from the top to the bottom of the `islandBackground` view.

## 2. Gesture and Animation Re-engineering

- [x] 2.1 Update the `Pan` gesture `onUpdate` handler to use positive `translationY` for expansion (`newPos = startState.value + stateDelta`).
- [x] 2.2 Re-calculate `islandHeight` and expansion limits based on `SCREEN_HEIGHT` and `insets.top`.
- [x] 2.3 Update `islandOpacity` and background interpolation to ensure smooth transitions in the new orientation.

## 3. Component Integration

- [x] 3.1 Adjust `AdaptiveControlOverlay` style to decouple its `translateY` from the island height (keep it bottom-pinned).
- [x] 3.2 Ensure `FloatingSearchBar` and `DiscoveryDashboard` maintain correct padding/margins within the top-down container.
- [x] 3.3 Verify that `isScrollAtTop` logic still correctly manages gesture vs. scroll priority for the downward expansion.

## 4. Verification

- [x] 4.1 Test snapping to Level 1, 2, and 3 from the top.
- [x] 4.2 Validate that the search input remains accessible and doesn't conflict with system status bar gestures.
- [x] 4.3 Confirm that background dimming correctly overlays the map as the island expands downwards.
