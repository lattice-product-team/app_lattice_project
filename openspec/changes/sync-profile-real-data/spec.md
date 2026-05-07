# Specification: Profile Data Synchronization

This specification defines the transition from hardcoded mock profile data to a dynamic, reactive system synchronized with the application's authentication state.

## 1. Data Model Updates

### 1.1 `User` (Auth Model)

Location: `apps/mobile/src/types/models/auth.ts`
Add the following optional fields to the `User` interface to support profile synchronization:

- `bio?: string`
- `stats?: { eventsAttended: number; savedEvents: number; latticePoints: number; }`
- `medals?: Medal[]`

### 1.2 `UserProfile` (Profile Model)

Location: `apps/mobile/src/features/profile/types.ts`
Ensure compatibility with the `User` model. The `id` type should be standardized (currently `string` in profile, `number` in auth).

## 2. State Management Logic

### 2.1 `useProfileStore` Initialization

- Remove `MOCK_PROFILE` as the initial state.
- Set the initial `profile` to `null`.

### 2.2 Sync Strategy

In `apps/mobile/app/(main)/profile.tsx`, implement a synchronization effect:

- If `isGuest` is true: Render the Guest UI.
- If `user` is present in `useAuthStore`:
  - Map `user` properties (`fullName`, `email`, `avatarUrl`) to a `UserProfile` object.
  - Update the `ProfileStore` with this data if it's not already synced.

## 3. UI Implementation

### 3.1 `ProfileHeader` Update

- Remove any remaining hardcoded text.
- Use `profile.name` (mapped from `fullName`) and `profile.bio`.
- If `isGuest`, show "Guest Explorer" as the name.

### 3.2 Guest Profile View

When `isGuest` is true, the profile screen should:

- Show a restricted view of stats (all 0 or hidden).
- Display a "Join the Community" banner or button that triggers the `AuthPromptSheet`.
- Use the `UserAvatar` with `isGuest={true}`.

## 4. Verification Plan

- **Login Flow**: Log in as a real user and verify the profile shows the correct name and email.
- **Guest Flow**: Enter as a guest and verify the profile shows the "Guest Explorer" state without Alex Rivera's data.
- **Logout Flow**: Verify that logging out clears the profile state.
