## Why

The current app startup experience lacks a premium "wow" factor and transitions abruptly between a system splash screen and a loading state or the main map. A high-fidelity, animated initialization sequence will reinforce the brand identity, provide visual continuity, and mask necessary background tasks (auth checks, data fetching) with a sophisticated aesthetic consistent with the "Liquid Glass" design language.

## What Changes

- **New Splash Screen**: A dedicated initialization screen featuring a vibrant animated gradient background and a centered "Glass" card containing the Lattice logo.
- **Refined App Entry**: Modification of `RootLayout` and the `Index` route to orchestrate a seamless transition from the splash screen to the main application or authentication flow.
- **Initialization Logic**: Centralized management of font loading, authentication state verification, and critical data pre-fetching during the splash animation.
- **Visual Continuity**: Smooth exit animations for the splash screen that reveal the map or onboarding flow with a sense of depth and fluidity.

## Capabilities

### New Capabilities
- `app-initialization-flow`: Manages the sequence of startup tasks and the presentation of the premium splash screen component.

### Modified Capabilities
- `eleven-design-system`: Add specific design tokens for the vibrant gradient and splash-specific glass effects.

## Impact

- **Mobile App**: Primary implementation area. Affects `app/_layout.tsx`, `app/index.tsx`, and introduces new components in `src/components/ui/`.
- **User Experience**: Immediate impact on perceived performance and brand quality from the first second of app launch.
- **Auth Store**: Orchestration of the initial session check will be synchronized with the splash animation.
