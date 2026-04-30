## 1. Theme Standardization

- [x] 1.1 Update `theme.ts` to set standard border width to 1px
- [x] 1.2 Calibrate `glass.border` opacity to 0.08 in Light Mode for better contrast
- [x] 1.3 Ensure Dark Mode border opacity remains at 0.12 but with 1px thickness

## 2. Component Refactoring (Overlay Pattern)

- [x] 2.1 Update `SafeBlurView.tsx` to include an absolute-positioned border overlay
- [x] 2.2 Update `EventCarouselCard.tsx` to move borders from container to overlay
- [x] 2.3 Remove `borderWidth` and `borderColor` from component containers that use `overflow: 'hidden'`

## 3. Global Integration

- [x] 3.1 Update the island container in `index.tsx` to use the new `SafeBlurView` border logic
- [x] 3.2 Audit other components (FloatingSearchBar, AdaptiveControlOverlay) for border clipping
- [x] 3.3 Remove any hardcoded `0.5` border values and replace with theme-based 1px

## 4. Verification

- [x] 4.1 Verify border sharpness on various backgrounds in Light Mode
- [x] 4.2 Ensure no touch events are blocked by the new border overlays
- [x] 4.3 Final visual check of corners to ensure zero clipping/bleeding
