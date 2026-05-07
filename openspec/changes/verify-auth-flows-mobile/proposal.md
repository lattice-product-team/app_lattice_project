## Why

The authentication flow is the gateway to the application. Recent changes (removing passkeys, updating themes) require a comprehensive verification of all login and registration paths to ensure stability, correct error handling, and a seamless user experience. We also need to address a reported bug where users are incorrectly redirected after email login.

## What Changes

- **Verification & Fixes**:
  - Test and verify the Email/Password login flow (success, invalid credentials, field validation).
  - Test and verify the Google OAuth login flow.
  - Test and verify the Email registration flow.
  - **FIX**: Ensure users are correctly redirected to the main application (`/(main)`) or their intended destination after successful login/registration, preventing loops or incorrect screen displays.
  - Verify that theme (light/dark) is correctly applied and consistent across all authentication screens.
  - Ensure all deprecated passkey references are fully purged and don't interfere with the flow.

## Capabilities

### New Capabilities
- `mobile-auth-verification`: A comprehensive test suite and manual verification checklist for all mobile authentication scenarios.
- `email-auth-flow`: Implementation and validation of the email/password authentication flow.

### Modified Capabilities
- `social-auth-provider`: Removing passkey triggers and updating redirection logic for social login flows.

## Impact

- `apps/mobile/app/(auth)/*`: All authentication screens.
- `apps/mobile/src/services/authService.ts`: Core authentication logic.
- `apps/mobile/src/store/useAuthStore.ts`: Authentication state management.
