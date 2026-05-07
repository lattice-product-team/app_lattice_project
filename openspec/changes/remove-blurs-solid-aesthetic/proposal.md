## Why

The current implementation relies heavily on `expo-blur` (via `SafeBlurView`) to achieve a glassmorphism effect. This has several drawbacks:

1. **Performance**: Blur rendering is expensive, especially on Android devices.
2. **Visual Inconsistency**: Stacking multiple blur layers (e.g., a button with blur inside a sheet with blur) causes oversaturated "white patches" and inconsistent contrast.
3. **Complexity**: Managing blur intensity and tints adds unnecessary complexity to the UI components.

Standardizing on high-quality solid colors with calibrated transparency (e.g., `rgba(255, 255, 255, 0.8)`) will provide a cleaner, more performant, and visually consistent "Modern Solid" aesthetic that works perfectly across both iOS and Android.

## What Changes

- **Theme Update**: Modify `glass` tokens in `theme.ts` to use higher-opacity solid colors instead of low-opacity "translucent" values.
- **Component Refactor**: Remove all instances of `SafeBlurView` and replace them with standard `View` components styled with the updated tokens.
- **Icon/Button Standardization**: Update all interactive circles (Share, Close, etc.) to use a uniform solid transparency formula, removing experimental "inner glow" or "blur" layers.
- **Performance Optimization**: Remove the overhead of real-time blur calculations from the main map overlays.

## Capabilities

### Modified Capabilities

- `eleven-design-system`: Update color tokens to move away from translucent glassmorphism towards "Modern Solid".
- `event-detail-sheet`: Replace all blur layers with solid-transparency backgrounds.
- `mini-card-ui`: Remove blur from the POI mini-card.
- `search-results-ui`: Standardize the search experience header without blur.

## Impact

- **Affected Code**: `theme.ts`, `SafeBlurView.tsx` (to be deprecated or simplified), `EventDetailSheet.tsx`, `POIMiniCard.tsx`, `FloatingSearchBar.tsx`, `index.tsx`.
- **Dependencies**: Potential removal of `expo-blur` dependency if no other features use it.
- **Visuals**: A cleaner, higher-contrast UI that feels more "professional" and less "experimental".
