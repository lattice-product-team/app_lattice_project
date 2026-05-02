## 1. Feature Setup

- [x] 1.1 Create feature directory structure at `apps/mobile/src/features/profile`
- [x] 1.2 Implement `useProfileStore` using Zustand for local state management
- [x] 1.3 Define types for UserProfile and Achievement/Medal

## 2. UI Component Implementation

- [x] 2.1 Create `ProfileHeader` with dynamic avatar and bio (Apple style)
- [x] 2.2 Create `ActionGrid` component for Tickets, Wallet, and Favorites
- [x] 2.3 Create `AchievementRow` for displaying medals/badges
- [x] 2.4 Create `SettingsGroup` for iOS-style list items

## 3. Screen Integration

- [x] 3.1 Update `apps/mobile/app/(main)/profile.tsx` to assemble the components
- [x] 3.2 Implement scroll-driven animations for the header using Reanimated
- [x] 3.3 Ensure all components use `theme.colors` and `theme.borderRadius.lg`

## 4. Polishing & Theme Support

- [x] 4.1 Verify Dark/Light mode transitions for all profile elements
- [x] 4.2 Add haptic feedback to action grid interactions
- [x] 4.3 Add empty states for Tickets and Achievements sections

## 5. Verification

- [ ] 5.1 Manual walkthrough of the profile screen in the simulator/device
- [ ] 5.2 Validate that no hardcoded colors are present in the new code
