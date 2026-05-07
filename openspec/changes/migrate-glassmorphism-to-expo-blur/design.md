## Context

The current `SafeBlurView` is heavily tied to Skia. While Skia provides superior control over displacement maps and fractal noise (the "Liquid" in Liquid Glass), its instability on standard Expo builds and requirement for precise native linking makes it an unreliable primary engine. Users are seeing flat backgrounds instead of premium blur.

## Goals / Non-Goals

**Goals:**
- Guarantee a blur effect is always visible on floating UI elements on both platforms.
- Simplify the dependency chain by reducing reliance on Skia for basic visual effects.
- Maintain the "Liquid Glass" branding while using more stable native primitives.

**Non-Goals:**
- Completely re-engineering the visual language of the app.
- Fixing Skia native issues (we will bypass them instead).

## Decisions

### 1. Unified Hyrbid Architecture for SafeBlurView
**Decision**: Refactor `SafeBlurView` to use a dynamic import/require pattern that checks for `expo-blur` and `Skia` in that order.
**Rationale**: `expo-blur` is the most stable option for iOS (native API). On Android, `expo-blur` is also very reliable. Skia will be kept as an "enhancement" layer if available, but the core blur will come from `expo-blur`.
**Alternatives**: 
- *Pure Skia*: Too unstable for current build environment.
- *Pure View (Translucent)*: Not premium enough for Lattice's design standards.

### 2. Standardized Intensity Presets
**Decision**: Standardize `SafeBlurView` props to match the `expo-blur` API where possible (intensity, tint) to ensure easy migration.
**Rationale**: Makes the internal component swap transparent to the rest of the application.

## Risks / Trade-offs

- **[Risk]** Android blur quality on old devices (< Android 12) might be lower without Skia. 
  - → **Mitigation**: Use higher opacity translucent fallbacks for older Android versions to maintain contrast.
- **[Risk]** Bundle size increase by adding `expo-blur`.
  - → **Mitigation**: `expo-blur` is very lightweight compared to Skia; removing Skia eventually would net a significant reduction.
