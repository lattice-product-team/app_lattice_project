## Why

The current authentication flow uses a white-based theme that suffers from severe contrast issues, making primary buttons and secondary text nearly invisible. The "Solar Gold" brand color loses its premium feel when placed on light backgrounds. Transitioning to a dark, high-contrast theme will resolve these visibility issues while creating a more immersive, "event-night" atmosphere consistent with the Lattice brand.

## What Changes

- **Theme Transition**: Shift `WelcomeScreen`, `LoginScreen`, and `RegisterScreen` to a dark mode layout.
- **Gradient Refinement**: Introduce a new `midnight` variant in `ThemeGradient` using deep charcoal and black tones.
- **Button Contrast**: Update `PremiumButton` logic to ensure primary actions use the `Solar Gold` gradient with high-contrast text.
- **Glassmorphism**: Enhance secondary buttons with real native blur effects on dark backgrounds.

## Capabilities

### New Capabilities
- `premium-dark-theme`: Implementation of a global-ready dark theme configuration specifically for the onboarding and authentication experience.

### Modified Capabilities
- `mobile-navigation`: UI polish across all auth-related routes.

## Impact

- **UI Components**: `ThemeGradient`, `PremiumButton`, and `AuthLayout` will be updated.
- **User Experience**: Significantly improved readability and accessibility in high-light conditions.
- **Visual Identity**: Stronger brand presence of the "Solar Gold" color system.
