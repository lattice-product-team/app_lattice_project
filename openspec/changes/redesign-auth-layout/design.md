## Context

The current authentication system is mandatory and uses a traditional layout. We are transitioning to a social-first, frictionless onboarding experience that allows guest exploration.

## Goals / Non-Goals

**Goals:**

- Implement a non-blocking "Guest Mode".
- Redesign Login/Register screens with progressive disclosure for email.
- Create a reusable Bottom Sheet for contextual authentication prompts.
- Establish a framework for Passkey onboarding.

**Non-Goals:**

- Full backend implementation of Passkeys (out of scope for this UI/UX change, will use a simulated success flow for now).
- Migration of existing user data.

## Decisions

### 1. Guest State Management

We will extend `useAuthStore` to include an `isGuest` boolean and a `hasSeenPasskeyPrompt` timestamp.

- **Rationale**: Centralizing the auth state ensures all components (navigation, protected buttons) can react to the guest status consistently.

### 2. Progressive Disclosure Animation

The Email/Password form expansion will use `react-native-reanimated` Layout Transitions (`Layout.springify()`).

- **Rationale**: Provides a fluid, premium feel that matches the "Apple-inspired" aesthetic without manual height calculations.

### 3. Contextual Auth Sheet

A new `AuthPromptSheet` component will be created using the project's standard Bottom Sheet pattern.

- **Rationale**: Consistent interaction model with the rest of the app's discovery features.

### 4. Social Auth Integration

- **Google**: Use `expo-auth-session/providers/google`.
- **Apple**: Use `expo-apple-authentication`.
- **Rationale**: Standard Expo-recommended libraries for cross-platform compatibility.

## Risks / Trade-offs

- **[Risk] Session Conflict** → If a guest user performs actions and then logs in, we must ensure their local state (e.g., a temporary search) is merged or handled correctly.
  - **Mitigation**: Implement a "Post-Auth Redirect" logic that remembers the last attempted protected action.
- **[Risk] Layout Jumping** → Rapidly expanding forms can cause layout shifts.
  - **Mitigation**: Use `ScrollView` with `keyboardShouldPersistTaps` and ensure the animation is fast enough (300ms).
