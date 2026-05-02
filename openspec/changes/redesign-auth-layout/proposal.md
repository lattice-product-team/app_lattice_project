## Why

The current authentication flow can be a barrier for new users who want to explore the map features quickly. By simplifying the login layout and introducing a "Guest Mode," we can increase user engagement and provide a smoother onboarding experience.

## What Changes

- **Layout Redesign**: Overhaul the Login and Register screens to follow a modern, minimal layout with Social Login (Google/Apple) prioritized at the top and Email login as a secondary option below an "OR" divider.
- **Guest Mode**: Add a "Skip for now" / "Continue as Guest" option to allow immediate access to the map without mandatory authentication.
- **Contextual Auth Prompts**: Implement a Bottom Sheet that triggers when a guest user tries to access protected features (Profile, Saved Places, etc.), inviting them to sign up or log in.
- **Passkey Onboarding**: Introduce an optional step after successful login/registration to enable Passkeys for future frictionless access.

## Capabilities

### New Capabilities
- `guest-access-mode`: Logic and UI state to handle unauthenticated exploration and contextual prompts.
- `passkey-onboarding`: A post-auth screen/prompt to setup FIDO2/WebAuthn passkeys.

### Modified Capabilities
- `user-auth`: Update existing authentication UI and flows to support the new layout and social-first hierarchy.

## Impact

- **UI/UX**: `apps/mobile/app/(auth)/login.tsx`, `register.tsx`, and a new `passkey-onboarding.tsx`.
- **Navigation**: Update root layout and main map navigation to handle guest states.
- **Components**: New `AuthPromptSheet` component for guest interaction.
- **Backend**: (Future) Support for Passkey registration/validation.
