## Why

The profile screen currently has several interactive elements (ActionGrid, SettingsGroup) that only provide haptic feedback but do not perform any actual actions or navigation. To make the profile a useful hub for the user, these buttons must be connected to their respective features.

## What Changes

- **ActionGrid Navigation**:
  - "Tickets" -> Navigate to `/ (main)/tickets` (if exists).
  - "Wallet" -> Navigate to `/ (main)/wallet` (if exists).
  - "Favorites" -> Navigate to `/ (main)/favorites` or a filtered view of the map.
- **SettingsGroup Functionality**:
  - "Logout" -> Call `useAuthStore.logout()` and redirect to login.
  - "Account Settings" -> Navigate to account management.
  - "Accessibility" -> Connect to the accessibility preferences already defined in the `User` model.
- **Guest Protection**: Intercept these actions for guest users, showing the `AuthPromptSheet` instead of navigating.

## Capabilities

### New Capabilities

- `profile-navigation`: Centralized handling of profile-related navigation logic.

### Modified Capabilities

- `user-settings`: Expand functionality to allow toggling accessibility preferences and logging out.

## Impact

- **UI/UX**: `apps/mobile/src/features/profile/components/ActionGrid.tsx`, `apps/mobile/src/features/profile/components/SettingsGroup.tsx`.
- **Navigation**: Update router paths and deep linking if necessary.
- **Auth Integration**: Ensure `useAuthStore` actions are correctly wired to the UI.
