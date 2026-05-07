## 1. Fix Redirection Logic

- [x] 1.1 Update `email-auth.tsx` success handler to ensure direct redirection to `/(main)` or `intendedDestination`.
- [x] 1.2 Update `email-register.tsx` success handler to ensure direct redirection to `/(main)` or `intendedDestination`.
- [x] 1.3 Update `login.tsx` Google success handler to ensure consistent redirection behavior.
- [x] 1.4 Ensure `setGuestMode(false)` is called upon any successful login/register.

## 2. Enhance Error Handling

- [x] 2.1 Refine `AuthService.ts` to return more specific error information from API responses.
- [x] 2.2 Update auth screens to use the `useLogin` and `useRegister` mutation `error` objects for displaying feedback.
- [x] 2.3 Add validation for empty fields in registration if not already present.

## 3. UI/Theme Verification

- [x] 3.1 Review and verify all auth screens in **Light Mode** (Onboarding, Login, Email Auth, Email Register).
- [x] 3.2 Review and verify all auth screens in **Dark Mode** (Onboarding, Login, Email Auth, Email Register).
- [x] 3.3 Adjust input field placeholder and border colors to be theme-aware across all auth screens.

## 4. Final Cleanup

- [x] 4.1 Perform a global search for "passkey" in the mobile app and remove remaining imports or comments.
- [x] 4.2 Verify `package.json` dependencies and consider removing `react-native-passkey` if no longer used.

## 5. Comprehensive Verification Suite

- [x] 5.1 **Test Case**: Successful Email Login -> Redirects to Map.
- [x] 5.2 **Test Case**: Failed Email Login -> Shows "Invalid credentials" error.
- [x] 5.3 **Test Case**: Successful Email Register -> Redirects to Map.
- [x] 5.4 **Test Case**: Successful Google Login -> Redirects to Map.
- [x] 5.5 **Test Case**: Session Persistence -> Kill app and restart -> Stay on Map.
- [x] 5.6 **Test Case**: Theming -> Toggle system theme -> All auth screens update correctly.
