## Context

The current authentication system in the Lattice mobile app has recently undergone significant visual and functional changes (theme support, passkey removal). This has introduced some instability, most notably a redirection bug where users are stuck on the "Welcome back" screen or redirected incorrectly after a successful email login. The system uses:

- **Expo Router** for navigation.
- **Zustand** (`useAuthStore`) for managing tokens, user data, and redirection state (`intendedDestination`).
- **Custom AuthService** for API calls (Google OAuth, Email/Password).
- **NativeWind & ThemeProvider** for light/dark mode.

## Goals / Non-Goals

**Goals:**

- **Standardize Redirection**: Ensure every authentication entry point (Login, Register, Google, Email) follows a consistent redirection logic.
- **Fix Redirection Loop**: Resolve the bug where users are redirected back to the login screen after success.
- **Robust Error Handling**: Provide clear visual feedback for common failures (invalid credentials, network issues, user already exists).
- **Theme Validation**: Ensure all authentication-related components (inputs, buttons, backgrounds) render correctly in both light and dark modes.
- **Cleanup**: Verify the complete removal of any residual passkey logic that might be interfering with the flow.

**Non-Goals:**

- Adding new authentication methods (e.g., Apple Sign-In).
- Refactoring the entire backend authentication API.
- Redesigning the main dashboard.

## Decisions

- **Decision 1: Unified Redirection Pattern**: We will consolidate the post-success logic. Instead of scattered `router.replace` calls, we will ensure all success handlers in `email-auth.tsx`, `email-register.tsx`, and `login.tsx` (Google flow) check `useAuthStore.getState().intendedDestination` first, defaulting to `/(main)` if null.
- **Decision 2: AuthService Error Normalization**: We will enhance `AuthService` to return more descriptive error messages from the backend to the UI.
- **Decision 3: Manual Verification Suite**: Since automated testing of OAuth flows can be complex in a sandbox, we will create a structured manual verification checklist covering all "edge cases" (e.g., backgrounding the app during Google auth).

## Risks / Trade-offs

- **[Risk] OAuth Redirects**: Google OAuth might fail in certain environment configurations (tunnel vs lan).
  - **Mitigation**: Test across all Expo connectivity modes.
- **[Risk] Persistent Guest Mode**: Guest mode state might conflict with logged-in state.
  - **Mitigation**: Ensure `setGuestMode(false)` is called upon successful login.
