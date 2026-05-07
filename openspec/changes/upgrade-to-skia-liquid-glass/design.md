## Context

The application currently relies on `expo-blur` for frosted glass effects. While functional, it lacks the performance and customization options needed for a "Liquid Glass" aesthetic, especially on Android where blur quality often degrades. By adopting `react-native-skia`, we can leverage GPU-accelerated shaders to create high-fidelity, fluid blur effects that are consistent across both iOS and Android.

## Goals / Non-Goals

**Goals:**
- Implement a high-performance "Liquid Glass" effect using `react-native-skia`.
- Ensure consistent visual quality and performance on both iOS and Android (Fabric/Paper compatible).
- Completely replace `expo-blur` usage in `SafeBlurView`.
- Maintain the "Layered Blur Pattern" established in previous refactors for maximum fidelity.

**Non-Goals:**
- Replace the entire UI with Skia; focus only on the blur and glass layers.
- Change the core layout of `EventDetailSheet` or `POIMiniCard`.

## Decisions

### 1. Skia BackdropBlur vs. Custom Shader
**Decision:** Use `BackdropBlur` from Skia as the primary mechanism, supplemented by a custom shader for the "Liquid" distortion if performance permits.
**Rationale:** `BackdropBlur` is highly optimized and provides the core frosted glass effect. Custom shaders allow for the organic, "liquid" variations that standard Gaussian blurs lack.
**Alternatives:** 
- Standard `expo-blur`: Rejected for lack of customization and Android performance issues.
- `react-native-blur`: Rejected in favor of Skia's unified cross-platform API.

### 2. Component Migration (SafeBlurView)
**Decision:** Refactor `SafeBlurView` to be a Skia `Canvas` that renders a `BackdropBlur`.
**Rationale:** This centralizes the Skia dependency and allows all existing components to benefit from the upgrade without changing their internal logic.

### 3. Layered Integration
**Decision:** Maintain the absolute sibling layer pattern. The Skia Canvas will sit as an `AbsoluteFill` sibling behind the content.
**Rationale:** Ensures that the blur effect only processes the background (map/content behind the sheet) and not the high-frequency content inside the sheet (text/icons), which would be computationally expensive and visually blurry.

## Risks / Trade-offs

- **[Risk] Skia Bundle Size**: Adding Skia increases the binary size.
- **[Mitigation]**: Skia is a powerful investment for future UI enhancements (charts, complex animations) beyond just blurs.
- **[Risk] Android Performance**: Some low-end Android devices may struggle with complex shaders.
- **[Mitigation]**: Implement a simplified shader fallback or lower blur iteration count for detected low-performance devices.
