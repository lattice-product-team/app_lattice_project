## Context

React Native's rendering engine often clips borders when `overflow: 'hidden'` is applied to the same view. This is especially noticeable on components using `expo-blur` (SafeBlurView) and cards with images (EventCarouselCard). The current use of `0.5` thickness and very low opacity tokens exacerbates the issue, making borders look "chewed" or invisible.

## Goals / Non-Goals

**Goals:**

- Ensure borders are consistently visible and sharp on all screens.
- Implement the "Border Overlay" pattern to prevent clipping.
- Standardize border thickness across the app.

**Non-Goals:**

- Changing the overall color palette (only opacity adjustments).
- Adding borders where they don't exist currently.

## Decisions

### 1. The Border Overlay Pattern

- **Decision**: Move `borderWidth` and `borderColor` from the main container to an absolute-positioned child view.
- **Rationale**: This ensures the border is drawn on top of the content and the clipping mask, preventing any "bleed" from the inner content.
- **Implementation**:
  ```tsx
  <View style={containerStyle}>
    {content}
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, borderOverlayStyle]} />
  </View>
  ```

### 2. Standardize on 1px Thickness

- **Decision**: Change default border thickness from `0.5` to `1`.
- **Rationale**: `1px` borders are more reliably anti-aliased by the GPU than `0.5px` borders when using semi-transparent colors. To maintain the subtle look, we will slightly decrease the alpha channel if necessary, but keep the 1px stroke.

### 3. Theme Calibration

- **Light Mode**: Increase `glass.border` from `rgba(0,0,0,0.04)` to `rgba(0,0,0,0.08)`.
- **Dark Mode**: Keep `rgba(255,255,255,0.12)` but ensure 1px thickness.

## Risks / Trade-offs

- [Risk] → Increased view count in the hierarchy.
- [Mitigation] → The overhead of one extra View per card/island is negligible in modern React Native.
- [Risk] → Border overlapping some absolute-positioned child elements.
- [Mitigation] → Use `zIndex: 100` on the border overlay if needed to ensure it stays on top.
