## Why

Currently, the profile screen and the search bar avatar use hardcoded "mock" data (e.g., Alex Rivera, Unsplash images). This creates a disconnected experience where users don't see their own identity reflected in the app. Synchronizing these with the real authentication state is essential for a professional, personalized urban discovery experience.

## What Changes

- **Dynamic Identity**: Replace all hardcoded names, emails, and images in `ProfileHeader` and `FloatingSearchBar` with reactive data from `useAuthStore`.
- **Profile Store Refactoring**: Update `useProfileStore` to initialize with the current authenticated user's data instead of a static mock object.
- **Data Model Alignment**: Ensure the `User` and `UserProfile` types are consistent, adding missing fields like `bio`, `stats`, and `medals` to the core user state where necessary.
- **Guest State Visibility**: Clearly reflect the "Guest" status in the profile UI, showing relevant prompts to sign up instead of showing mock user data.

## Capabilities

### New Capabilities
- `profile-data-sync`: Logic to bridge the gap between `AuthStore` (identity) and `ProfileStore` (extended data).

### Modified Capabilities
- `user-profile-ui`: Update the profile screen components to be fully data-driven.
- `navigation-context`: Ensure the search bar correctly reflects the user state across different map contexts.

## Impact

- **UI/UX**: `apps/mobile/app/(main)/profile.tsx`, `apps/mobile/src/features/profile/components/ProfileHeader.tsx`.
- **State Management**: `apps/mobile/src/features/profile/store/useProfileStore.ts`, `apps/mobile/src/store/useAuthStore.ts`.
- **Components**: `apps/mobile/src/components/ui/UserAvatar.tsx` (already created, will be the standard).
