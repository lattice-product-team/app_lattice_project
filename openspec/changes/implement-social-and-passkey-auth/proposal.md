## Why

The current authentication system relies on email/password, which is high-friction for mobile users. By implementing Social Login (Google/Apple) and Passkeys, we provide a modern, secure, and frictionless entry point that aligns with premium App Store standards.

## What Changes

- **Social Login Integration**: 
    - Implement native Apple Sign-In flow.
    - Implement Google Sign-In flow (via AuthSession or native).
    - Create backend handlers to verify social tokens and manage user creation/login.
- **Passkey System**:
    - Implement registration of FIDO2/WebAuthn credentials after successful social auth.
    - Implement Passkey-based login for returning users.
- **Unified Auth Logic**: The system will automatically detect if a social login corresponds to a new account (registration) or an existing one (login).

## Capabilities

### New Capabilities
- `social-auth-provider`: Logic to handle OAuth2/OpenID tokens from Apple/Google.
- `passkey-vault`: Implementation of secure biometric authentication on the device.

### Modified Capabilities
- `auth-server`: New routes and controllers for social and passkey verification.

## Impact

- **Mobile**: `apps/mobile/app/(auth)/login.tsx`, plus new services for Apple/Google/Passkeys.
- **Backend**: `apps/server/auth/routes/auth.routes.ts`, new controllers and database schema updates for credential storage.
