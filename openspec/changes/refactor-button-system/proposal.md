## Why

The current `PremiumButton` component uses a naming convention that doesn't fit the app's aesthetic ("looks bad") and relies on gradients that are being phased out. We need a more generic, versatile, and modern `Button` component that follows the new design language (flat colors, specific variants) while staying true to the app's brand identity.

## What Changes

- **Rename**: Rename `PremiumButton` to `Button` across the codebase.
- **Style Reset**: Completely remove the existing gradient-based styling.
- **New Variants**: Implement 4 distinct variants based on the provided design reference:
  - **Primary**: Solid brand color background with inverse text.
  - **Subdued**: Soft brand-tinted background with brand color text.
  - **Tertiary**: Dark/Neutral background (surface-like) with primary text.
  - **Ghost**: Transparent background with brand color text.
- **Theming**: Ensure all variants have proper Light and Dark mode representations.
- **Refactor**: Update all current usages of `PremiumButton` to use the new `Button` component and map existing variants to the new system.

## Capabilities

### New Capabilities
- `button-system`: A new, standardized button component with 4 variants (Primary, Subdued, Tertiary, Ghost) that supports light/dark modes and removes all gradients.

### Modified Capabilities
- `ui-components`: Update the core UI component library to include the new `Button` and deprecate/remove `PremiumButton`.

## Impact

- **UI Components**: `apps/mobile/src/components/ui/Button.tsx` (new) / `PremiumButton.tsx` (removed).
- **Theme**: Potential minor updates to `theme.ts` to support specific button variant tokens if needed.
- **Global Search**: All files importing `PremiumButton` will need to be updated.
- **Consistency**: Improved visual consistency across `AuthPromptSheet`, `EventDetailSheet`, and other feature areas.
