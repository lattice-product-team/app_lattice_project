## 1. Component Refactoring

- [x] 1.1 Update `FloatingSearchBarProps` to include `editable` (boolean) and `onPress` (callback)
- [x] 1.2 Pass `editable` prop to the `TextInput` in `FloatingSearchBar.tsx`
- [x] 1.3 Ensure the `UserAvatar` and right actions still respond to touches even when the search bar is not editable

## 2. Page Logic & Gesture Integration

- [x] 2.1 Pass `editable={islandState.value > 0.1}` to `FloatingSearchBar` in `index.tsx`
- [x] 2.2 Wrap `FloatingSearchBar` in a `Pressable` that triggers `islandState.value = withSpring(0.5)` when `islandState.value < 0.1`
- [x] 2.3 Set `pointerEvents="box-none"` on the wrapper `Pressable` to ensure gestures propagate correctly

## 3. UI Optimization & Polish

- [x] 3.1 Increase `paddingTop` of `handleContainer` from `5px` to `15px` in `index.tsx`
- [x] 3.2 Adjust `islandHeader` padding to maintain visual vertical alignment with the new handle padding
- [x] 3.3 Verify that tapping the search bar at Level 1 correctly expands the sheet without opening the keyboard
- [x] 3.4 Verify that dragging from the search bar area at Level 1 expands the sheet smoothly on Android
