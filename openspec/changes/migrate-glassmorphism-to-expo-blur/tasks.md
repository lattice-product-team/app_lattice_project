## 1. Infrastructure & Cleanup

- [x] 1.1 Install `expo-blur` in the mobile app.
- [x] 1.2 Remove any explicit Skia dependencies that are no longer needed for basic UI.
- [x] 1.3 Add types for `expo-blur` if required.

## 2. SafeBlurView Refactoring

- [x] 2.1 Update `SafeBlurView.tsx` to import `BlurView` from `expo-blur`.
- [x] 2.2 Implement the multi-tier render logic (Skia -> Expo Blur -> Translucent View).
- [x] 2.3 Ensure Reanimated integration (using `createAnimatedComponent`) works with the new `BlurView` structure.

## 3. UI Integration & Verification

- [x] 3.1 Verify `FloatingSearchBar` correctly displays blur behind it on iOS.
- [x] 3.2 Verify `DiscoveryDashboard` (island) correctly displays blur on iOS.
- [x] 3.3 Test fallback behavior on Android emulator to ensure no crashes.
- [x] 3.4 Increase navigation timeout in `app/index.tsx` to 50ms for safer mounting in slow environments.
