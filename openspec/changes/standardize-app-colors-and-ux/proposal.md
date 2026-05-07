## Why

The Lattice mobile application currently contains numerous hardcoded hex values and color strings across its components. This leads to visual inconsistency, complicates the maintenance of light and dark themes, and deviates from professional design system standards. Standardizing these colors will ensure a cohesive, premium brand experience and simplify future UI updates.

## What Changes

- **Centralized Color Primitives**: Refine `src/styles/colors.ts` to include a complete, professional palette (Solar Gold, Midnight, Pristine, etc.).
- **Semantic Theme Tokens**: Update `src/styles/theme.ts` with comprehensive semantic tokens (e.g., `brand.primary`, `bg.surface`, `text.muted`) that map to primitives based on the active theme.
- **Component Refactoring**: Replace all hardcoded colors in component styles with theme tokens.
- **UX/UI Review**: Evaluate color usage for accessibility (contrast), hierarchy, and "Midnight Glass" aesthetic alignment.
- **Deprecation**: Formally deprecate direct usage of `colors.ts` primitives in components in favor of the `theme` object.

## Capabilities

### New Capabilities

- `design-system-tokens`: Establish a robust, semantic-first color management system that supports dynamic theming and ensures UI consistency.

### Modified Capabilities

- (None)

## Impact

- **Affected Code**: All UI components in `apps/mobile/src/components` and screens in `apps/mobile/app`.
- **Styling Layer**: `src/styles/theme.ts` and `src/styles/colors.ts` will become the single source of truth for visuals.
- **Dependencies**: No new external dependencies; leverages existing React Native and Expo styling patterns.
