# Specification: Social Auth Provider

This specification defines the implementation of Google and Apple authentication for the Lattice mobile app and backend.

## 1. Mobile Implementation

### 1.1 Apple Sign-In
- **Library**: `expo-apple-authentication`
- **Flow**: 
    1. User clicks "Continue with Apple".
    2. Request `FullName` and `Email` scopes (only available on first sign-in).
    3. Receive `identityToken` and `authorizationCode`.
    4. Send `identityToken` to Backend `/auth/apple`.

### 1.2 Google Sign-In
- **Library**: `expo-auth-session/providers/google`
- **Flow**:
    1. User clicks "Continue with Google".
    2. Open Google Auth UI.
    3. Receive `idToken`.
    4. Send `idToken` to Backend `/auth/google`.

## 2. Backend Implementation

### 2.1 Endpoints
- `POST /auth/apple`:
    - Payload: `{ token: string, fullName?: { firstName: string, lastName: string } }`
    - Logic: Verify token with Apple Public Keys. Extract `sub` (Apple ID) and email.
- `POST /auth/google`:
    - Payload: `{ token: string }`
    - Logic: Verify token with `google-auth-library`. Extract `sub` (Google ID), email, name, and picture.

### 2.2 User Matching Logic
- **Existing User**: If the provider ID or email matches an existing user, return a Lattice JWT for that user.
- **New User**: 
    1. Create a new user record.
    2. Auto-fill `fullName`, `email`, and `avatarUrl` from provider data.
    3. Return a Lattice JWT.

## 3. Security
- Tokens must be verified on the server side using the respective provider's public keys.
- JWTs issued by Lattice must have a standard expiration (e.g., 24h) and include the user ID.

## 4. Scenarios

#### Scenario: First time Social Login
- GIVEN a user with no Lattice account
- WHEN they sign in with Google
- THEN a new account is created AND they are redirected to the map AND the Passkey onboarding is triggered.

#### Scenario: Existing Social Login
- GIVEN a user who previously registered with Apple
- WHEN they sign in with Apple again
- THEN they are logged into their existing account AND no Passkey prompt is shown (if already set up).
