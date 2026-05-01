## 1. Store and State

- [x] 1.1 Extend `useAuthStore` with `isGuest` and `hasSeenPasskeyPrompt` state.
- [x] 1.2 Implement `setGuestMode` and `clearGuestMode` actions.

## 2. Core UI Components

- [x] 2.1 Refine `PremiumButton` with official Google/Apple branding variants.
- [x] 2.2 Create `AuthPromptSheet` component for guest interception.
- [x] 2.3 Implement the "OR" divider component with subtle styling.

## 3. Authentication Screens Redesign

- [x] 3.1 Overhaul `login.tsx` layout to prioritize Social Login at the top.
- [x] 3.2 Implement "Connect with Email" button and animated form disclosure in `login.tsx`.
- [x] 3.3 Add "Skip for now" / "Continue as Guest" link to the auth footer.
- [x] 3.4 Sync `register.tsx` layout with the new minimal aesthetic.

## 4. Guest Mode Integration

- [x] 4.1 Update navigation logic to allow `isGuest` users into the `(main)` group.
- [x] 4.2 Add contextual triggers for `AuthPromptSheet` in Profile and Saved Places components.
- [x] 4.3 Implement post-auth redirection to resume the last attempted action.

## 5. Passkey Onboarding

- [x] 5.1 Create `PasskeyIntro` onboarding screen based on reference design.
- [x] 5.2 Implement logic to trigger onboarding after first successful registration/login.
- [x] 5.3 Integrate native Passkey creation APIs (or simulated flow for prototype).

## 6. Polishing and Legal

- [x] 6.1 Add legal footer with links to Terms and Privacy Policy.
- [x] 6.2 Ensure all animations (Layout Transitions) are smooth and performant.
