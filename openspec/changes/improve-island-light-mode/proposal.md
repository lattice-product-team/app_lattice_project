## Why

The "Midnight Island" discovery dashboard currently lacks sufficient visual contrast in light mode. Hardcoded white text and icon colors, along with inconsistent blur tinting, make the interface illegible and break the premium aesthetic when the system theme is set to light.

## What Changes

- **Thematic Consistency**: Replace all hardcoded color values with semantic tokens from the `LatticeTheme`.
- **Contrast Optimization**: Adjust icon and text colors in `DiscoveryDashboard` and `AdaptiveControlOverlay` to properly toggle between `text.primary` and `text.secondary` based on the active theme.
- **Blur Refinement**: Ensure `SafeBlurView` correctly uses the `glass.tint` token (light/dark) instead of potentially hardcoded values.
- **Pill Aesthetics**: Update category pill backgrounds to use `glass.subtle` or similar tokens to maintain the "glassmorphism" look in both themes.

## Capabilities

### Modified Capabilities
- `ui-components`: Refinement of global UI component styles for light mode contrast.
- `map-interface`: Adjustment of HUD and Island contrast on the map.

## Impact

- `apps/mobile/src/features/map/components/DiscoveryDashboard.tsx`
- `apps/mobile/src/features/map/components/AdaptiveControlOverlay.tsx`
- `apps/mobile/app/(main)/index.tsx`
- `apps/mobile/src/styles/theme.ts` (if new tokens are needed)
