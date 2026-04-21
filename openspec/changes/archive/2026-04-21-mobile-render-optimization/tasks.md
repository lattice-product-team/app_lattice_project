## 1. Location Store & Hook Refactor

- [x] 1.1 Create `src/store/useLocationStore.ts` to manage coordinates and status globally.
- [x] 1.2 Refactor `useLocationService.ts` to update the global store instead of using local `useState`.
- [x] 1.3 Implement distance-based thresholding in `useLocationService.ts` to throttle logical state updates.

## 2. MainScreen Optimization

- [x] 2.1 Refactor store subscriptions in `app/index.tsx` to use atomic selectors for `uiState`, `selectedPoi`, etc.
- [x] 2.2 Remove local location state dependencies from `MainScreen`'s render path.
- [x] 2.3 Optimize POI filtering `useMemo` to ensure it only runs when necessary data changes.

## 3. MapContent Refactor

- [x] 3.1 Remove `userCoords` and `locationStatus` props from `MapContent.tsx`.
- [x] 3.2 Update `MapContent` to subscribe to the global location store only where needed (e.g., for routing logic).
- [x] 3.3 Ensure `MapLibreGL.UserLocation` is configured for native-only visual updates.

## 4. Verification & Validation

- [x] 4.1 Verify that `MainScreen` does not re-render on user movement.
- [x] 4.2 Verify that routing recalculates correctly when moving beyond the distance threshold.
- [x] 4.3 Audit map performance to ensure stable frame rates during movement.
