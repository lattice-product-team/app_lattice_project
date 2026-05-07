## Why

The current glassmorphism implementation relies on `@shopify/react-native-skia`, which is frequently failing to load due to native module linking issues and environment incompatibilities. This results in a broken UI experience with flat, opaque backgrounds instead of the intended "Liquid Glass" aesthetic. 

## What Changes

- **REMOVE**: `@shopify/react-native-skia` as the primary blur engine.
- **ADD**: `expo-blur` to provide native, hardware-accelerated blur across both iOS and Android.
- **MODIFY**: `SafeBlurView` component to prioritize native `BlurView` while maintaining high-fidelity glassmorphism properties.
- **REFACTOR**: All UI components currently using Skia-based glassmorphism to use the updated `SafeBlurView`.

## Capabilities

### New Capabilities
- `native-glassmorphism`: A robust, multi-tier blur system that leverages platform-native APIs to ensure 100% reliability for glassmorphism effects.

### Modified Capabilities
- `ui-glassmorphism`: Standardize the visual rules for glass effects to be platform-agnostic.

## Impact

- **Dependencies**: Removing `@shopify/react-native-skia`, adding `expo-blur`.
- **UI Components**: `SafeBlurView`, `FloatingSearchBar`, `AdaptiveControlOverlay`, `EventDetailSheet`.
- **Performance**: Significant reduction in JS thread overhead by moving to native blur implementations.
