## Why

The current `expo-blur` implementation provides a basic blur effect that lacks the visual depth and performance required for a high-end "Liquid Glass" UI. Upgrading to `react-native-skia` will allow for hardware-accelerated, shader-based blur effects that are consistent and performant across both iOS and Android.

## What Changes

- **BREAKING**: Replace `expo-blur` with `@shopify/react-native-skia` as the primary engine for blurred UI components.
- Refactor `SafeBlurView` to use Skia's `BackdropBlur` or custom shaders to achieve the "Liquid Glass" aesthetic.
- Remove all remaining traces of the old `expo-blur` system from the codebase.
- Implement a unified blur architecture that works seamlessly on both iOS and Android with optimized GPU performance.

## Capabilities

### New Capabilities

- `liquid-glass-ui`: Defines the visual standards and technical requirements for the new shader-based blur system.

### Modified Capabilities

- `pure-ui-animation-bridge`: Update to ensure Skia-based effects integrate smoothly with the existing animation system.

## Impact

- **Dependencies**: Adds `@shopify/react-native-skia`, removes `expo-blur` usage.
- **UI Components**: `SafeBlurView`, `EventDetailSheet`, `POIMiniCard`, `AdaptiveControlOverlay`.
- **Platforms**: Full cross-platform parity (iOS/Android) for blur effects.
