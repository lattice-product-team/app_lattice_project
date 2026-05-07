# Tasks: sync-profile-real-data

- [x] **Infrastructure & Models**
  - [x] Update `User` interface in `auth.ts` with bio/stats/medals
  - [x] Standardize ID types between `User` and `UserProfile`
  - [x] Clean up `useProfileStore.ts` (remove MOCK_PROFILE)

- [x] **Data Synchronization**
  - [x] Implement sync logic in `profile.tsx` to map `AuthStore.user` to `ProfileStore`
  - [x] Ensure `isGuest` state is handled in the profile screen

- [x] **UI Refinement**
  - [x] Update `ProfileHeader` to be 100% data-driven
  - [x] Implement the Guest-specific UI for the profile screen
  - [x] Add a "Join Lattice" call to action for guests in the profile

- [ ] **Verification**
  - [ ] Test real user profile data rendering
  - [ ] Test guest mode profile state
  - [ ] Verify state cleanup on logout
