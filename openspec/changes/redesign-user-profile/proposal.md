## Why

The current profile screen is empty. Users need a central, private hub to manage their identity, track their event attendance history, and quickly access functional utilities like tickets and payment methods. This change establishes a premium, Apple-inspired interface that balances personal expression with high-utility event management, reinforcing the "Lattice" brand experience.

## What Changes

- **Identity Header**: A premium hero section featuring a high-resolution avatar, user name, and short bio, utilizing dynamic typography and glassmorphism backgrounds.
- **Action Grid**: A functional grid of cards for rapid access to "My Tickets", "Saved Events", and "Lattice Wallet".
- **Achievement System (Gamification)**: Integration of "Lattice Medals"—a visual system of badges earned through event attendance, similar to Apple Fitness medals.
- **Account & Privacy List**: An iOS-style grouped list for managing account settings, notification preferences, and privacy.
- **Theme Integration**: Full support for Light and Dark modes using strictly defined design tokens from `theme.ts` (no hardcoded colors).
- **Navigation**: Replacement of the existing placeholder at `apps/mobile/app/(main)/profile.tsx`.

## Capabilities

### New Capabilities

- `user-profile`: Manages the display and logic for user personal data, event history, and achievement status.

### Modified Capabilities

- None.

## Impact

- **Mobile App**: `apps/mobile/app/(main)/profile.tsx` will be fully implemented.
- **Feature Directory**: New structure at `apps/mobile/src/features/profile/` for components, hooks, and state.
- **State Management**: New store (Zustand) for profile data and achievement progress.
- **Assets**: Introduction of premium medal icons/assets.
