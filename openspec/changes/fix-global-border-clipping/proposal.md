## Why

Many UI components currently experience "border clipping" where the inner content (like blur effects or images) bleeds over the border or covers it partially. This is a known limitation of how React Native handles `overflow: 'hidden'` with `borderWidth` and `borderRadius`. Fixing this is essential to maintain the premium "Apple-style" aesthetic and ensure high-fidelity UI across all device screens.

## What Changes

- **Border Overlay Implementation**: Refactor components like `SafeBlurView` and `EventCarouselCard` to use a separate absolute-positioned layer for borders that sits on top of all content.
- **Border Thickness Standardization**: Migrate from `0.5` (hairline) to a more robust `1` pixel thickness for better visibility and consistent anti-aliasing.
- **Theme Token Calibration**: Update the `border` and `glass.border` tokens in `theme.ts` to use slightly higher opacities that provide clear definition against various backgrounds.

## Capabilities

### New Capabilities
- `border-overlay-system`: A standardized implementation pattern to ensure borders are never clipped by inner content.

### Modified Capabilities
- `design-tokens`: Update requirements for border thickness and opacity to ensure visibility and contrast.

## Impact

- `apps/mobile/src/styles/theme.ts` (Token updates)
- `apps/mobile/src/components/ui/SafeBlurView.tsx` (Architecture update)
- `apps/mobile/src/features/map/components/EventCarouselCard.tsx` (Component update)
- `apps/mobile/app/(main)/index.tsx` (Island border updates)
