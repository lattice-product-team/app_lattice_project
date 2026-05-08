## 1. UI Components (Profile Redesign)

- [x] 1.1 Create `ProfileSheet` container (independent overlay) with its own `GestureDetector` and `islandState`.
- [x] 1.2 Implement `GamifiedHeader` (Avatar, Level progress bar, Confidence label) matching the reference style.
- [x] 1.3 Create `StatsGrid` and `StatCard` components (Daily activities, Streak, Time spent).
- [x] 1.4 Add `ProfileControlBar` with top-aligned Gear (Settings) and X (Close) icons integrated into the sheet header.

## 2. Integration & State

- [x] 2.1 Integrate `ProfileSheet` into the main screen's layout, positioned above the main island.
- [x] 2.2 Implement "Main Island Hide" logic: animate main island to 0 when `ProfileSheet` is opened.
- [x] 2.3 Refactor `apps/mobile/app/(main)/profile.tsx` to act as a trigger for the dropdown expansion.

## 3. Data & Actions

- [x] 3.1 Connect components to `useProfileStore` and `useAuthStore` for dynamic user data.
- [x] 3.2 Implement the "Close" action to hide the `ProfileSheet` and restore the main island.
- [x] 3.3 Ensure "Settings" and other actions are functional within the dropdown context.

## 4. Verification

- [x] 4.1 Verify visual alignment with the provided screenshot (colors, spacing, typography).
- [x] 4.2 Test smooth transitions between Compact, Nivel 2 (Discovery), and Nivel 2 (Profile) states.
- [x] 4.3 Validate that interaction with stats cards and buttons works without gesture conflicts.
