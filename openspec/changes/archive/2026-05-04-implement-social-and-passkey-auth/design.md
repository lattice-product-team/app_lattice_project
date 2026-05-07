# Design: Social & Passkey Authentication Architecture

This document outlines the architectural decisions for integrating Google, Apple, and Passkey authentication into the Lattice ecosystem.

## 1. Tech Stack Decisions

### 1.1 Client-Side (React Native / Expo)

- **Apple Auth**: `expo-apple-authentication`. It provides the most stable native integration for iOS.
- **Google Auth**: `expo-auth-session/providers/google`. It's the standard for Expo managed/dev-client apps.
- **Passkeys**: `react-native-passkey`. This is a robust wrapper for the native iOS ASAuthorizationController and Android Credential Manager.

### 1.2 Server-Side (Node.js / Express / Drizzle)

- **Validation**: `google-auth-library` and `apple-signin-verify`.
- **Passkey Logic**: `@simplewebauthn/server`. This is the industry standard for WebAuthn/FIDO2 in Node.js.

## 2. Component Architecture

### 2.1 `AuthService` (Mobile)

A new service layer to centralize auth logic:

```typescript
class AuthService {
  async signInWithApple(): Promise<AuthResult>;
  async signInWithGoogle(): Promise<AuthResult>;
  async registerPasskey(): Promise<void>;
  async signInWithPasskey(): Promise<AuthResult>;
}
```

### 2.2 `SocialAuthMiddleware` (Backend)

New controllers in `apps/server/auth` to handle the verification of social tokens and creation of users.

## 3. Data Flow: The "Upgrade" Path

We will implement an "Upgrade to Passkey" interceptor:

1. User logs in via Google/Apple.
2. App checks `useAuthStore` for `hasPasskey` flag.
3. If `false` and it's a new session, show the `PasskeyOnboardingSheet`.
4. Once created, the user is "upgraded" to biometric-first login.

## 4. UI Patterns

- **AuthPromptSheet**: Will be updated to include the "Login with Passkey" option if a passkey is detected for the current email (using local storage hint).
- **Onboarding**: A dedicated premium-styled screen for the Passkey setup, explaining the benefits (Security + Speed).

## 5. Security Considerations

- **Non-Exportable Keys**: Passkeys are stored in the device's Secure Enclave/Keystore and cannot be exported.
- **CSRF Protection**: All WebAuthn challenges must be stateful or include a nonce tied to the user's temporary session.
