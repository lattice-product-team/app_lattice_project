## 1. Environment Setup

- [x] 1.1 Install `@shopify/react-native-skia` in `apps/mobile`
- [x] 1.2 Verify Skia installation by rendering a simple canvas test in a debug view
- [x] 1.3 Remove `expo-blur` from `package.json` dependencies in `apps/mobile`

## 2. SafeBlurView Refactor

- [x] 2.1 Refactor `SafeBlurView.tsx` to use Skia's `Canvas` and `BackdropBlur`
- [x] 2.2 Implement safe import pattern to prevent hard crashes if native module is missing
- [x] 2.3 Implement the "Liquid" shader logic within `SafeBlurView`
- [x] 2.4 Ensure the component accepts `intensity` and `tint` props to maintain backward compatibility

## 3. UI Integration & Cleanup

- [x] 3.1 Update `EventDetailSheet.tsx` to use the new Skia-based `SafeBlurView` with the layered pattern
- [x] 3.2 Update `POIMiniCard.tsx` to use the new Skia-based `SafeBlurView` with the layered pattern
- [x] 3.3 Update `AdaptiveControlOverlay.tsx` to ensure its blur is consistent with the new system
- [x] 3.4 Remove any remaining imports or references to `expo-blur` across the codebase

## 4. Verification & Native Rebuild

- [ ] 4.1 Perform a native rebuild (`npx expo prebuild` or full build) to link Skia modules
- [x] 4.2 Verify blur performance on iOS (physical device if possible)
- [x] 4.3 Verify blur quality and performance on Android (physical device if possible)
- [x] 4.4 Verify that the "Liquid" effect reacts correctly to gesture-driven animations
