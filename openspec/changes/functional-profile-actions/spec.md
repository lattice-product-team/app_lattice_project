# Specification: Functional Profile Actions

This specification defines the implementation of interactive actions and navigation for the profile screen components.

## 1. Action Connectivity

### 1.1 `ActionGrid` Navigation
The `ActionGrid` buttons should trigger navigation to the following paths:
- **Tickets**: `/(main)/tickets`
- **Wallet**: `/(main)/wallet`
- **Favorites**: `/(main)/saved` (or equivalent)

If a route is not yet implemented, a fallback `Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)` should be used alongside a `console.log`.

### 1.2 `SettingsGroup` Functionality
- **Logout**: The "Cerrar Sesión" item must call `useAuthStore.getState().logout()`. This will clear the session and trigger the automatic redirect to the auth flow.
- **Account Info**: Should navigate to a sub-screen (future work, placeholder for now).

## 2. Implementation Strategy

### 2.1 Prop Injection
Since `ActionGrid` and `SettingsGroup` are currently internal components with hardcoded behavior, they will be updated to accept `onPress` handlers or use the `useRouter` hook internally.

### 2.2 Auth Integration
The `SettingsGroup` will consume the `useAuthStore` to perform the logout action and potentially clear the `ProfileStore` state.

## 3. Verification Plan

- **Logout Test**: Click "Cerrar Sesión" and verify the user is redirected to the Welcome screen and all local storage is cleared.
- **Navigation Test**: Click on "Tickets" and "Wallet" to verify navigation attempts (checking if the router tries to push the correct paths).
