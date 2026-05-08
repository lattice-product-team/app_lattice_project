## 0. Hierarchy Cleanup & Preparation

- [ ] 0.1 Flatten the JSX structure in `index.tsx`, moving all overlays to a consistent stack at the bottom.
- [ ] 0.2 Standardize z-indices for all major UI elements (Map: 0, HUD: 1000, Bottom Sheets: 2000, Top Island: 3000).
- [ ] 0.3 Implement the new route components (`RoutePlanningSheet`, `CenteringButton`) in the standard overlay stack.

## 1. Core State Refactoring

- [ ] 1.1 Introduce `UI_LAYER` shared value in `index.tsx` to manage overlay exclusivity.
- [ ] 1.2 Remove all direct `.value` accesses from the `MapIndexPage` component body to eliminate React render warnings.
- [ ] 1.3 Implement `useDerivedValue` for top/bottom sheet visibility based on `UI_LAYER`.

## 2. HUD Visibility & Controller

- [ ] 2.1 Implement `controlsOpacityStyle` using `withTiming` based on active bottom sheets.
- [ ] 2.2 Update `AdaptiveControlOverlay` to accept visibility from the parent or derive it from `UI_LAYER`.
- [ ] 2.3 Implement logic to hide the Main Dropdown completely when `isNavigating` is TRUE.

## 3. Main Dropdown (Top Island) Enhancement

- [ ] 3.1 Refactor `islandState` snaps and styles to support the 3 levels (Very Small, Small, Full).
- [ ] 3.2 Implement `islandBackgroundStyle` with ST (Semi-Transparent) to NT (Non-Transparent) transitions.
- [ ] 3.3 Add `useAnimatedReaction` to automatically collapse Top Island to Level 1 when a bottom sheet opens.

## 4. Bottom Sheet Refactoring (Profile & Events)

- [ ] 4.1 Update `EventDetailSheet` to support 2 levels (Small ST / Medium NT) and sync with `UI_LAYER`.
- [ ] 4.2 Update `ProfileSheet` to support 2 levels (Small ST / Medium NT) and sync with `UI_LAYER`.
- [ ] 4.3 Implement fade-out of bottom HUD buttons when these sheets are active.

## 5. Testing & Performance

- [ ] 5.1 Verify all transitions are 60fps and bridge congestion is eliminated.
- [ ] 5.2 Test edge cases: opening Profile while searching, starting navigation while a sheet is open.
