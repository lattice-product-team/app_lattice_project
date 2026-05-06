# Tasks: implement-social-and-passkey-auth

- [x] **Infrastructure & Setup**
    - [x] Install `expo-apple-authentication`, `expo-auth-session`, `react-native-passkey`
    - [x] Install `@simplewebauthn/server` in the auth server
    - [x] Configure `app.json` (app.config.ts) for Apple Sign-In and Google Client IDs

- [x] **Backend Development**
    - [x] Create `POST /auth/google` endpoint
    - [x] Create `POST /auth/apple` endpoint
    - [x] Implement WebAuthn challenge/register endpoints
    - [x] Update database schema for Passkey credentials

- [x] **Mobile Development**
    - [x] Implement `AuthService.ts` for social providers
    - [x] Wire "Continue with Apple/Google" buttons in `login.tsx`
    - [x] Create `PasskeyOnboardingSheet` component
    - [x] Implement Passkey registration/login logic

- [x] **Integration & UI**
    - [x] Add "Upgrade to Passkey" prompt after social login
    - [x] Update `AuthPromptSheet` with Passkey option
    - [x] Test end-to-end flows for new and returning users

- [x] **Verification**
    - [x] Verify Google Sign-In on iOS/Android
    - [x] Verify Apple Sign-In on iOS
    - [x] Verify Passkey registration and subsequent login
