## Context

The mobile application currently uses `expo-blur` to create a glassmorphism effect for map overlays, bottom sheets, and interactive buttons. While visually appealing on high-end iOS devices, this approach leads to performance degradation on Android and visual artifacts (saturated white patches) when translucent layers overlap. The recent success of using `rgba(255, 255, 255, 0.8)` for the search bar has proven that a solid-transparency approach is superior for consistency and performance.

## Goals / Non-Goals

**Goals:**

- **Zero Blur Dependency**: Completely remove the need for `expo-blur` in the main map UI.
- **Consistent Contrast**: Ensure that buttons and text are perfectly legible against both the map and the background sheet.
- **Performance Parity**: Achieve identical UI performance on both iOS and Android.
- **Design Unification**: Align all detail sheets and mini-cards with the main search bar's "Modern Solid" aesthetic.

**Non-Goals:**

- Removing blur from other parts of the app that don't overlap the map (if any).
- Changing the layout or functional logic of the detail sheets.

## Decisions

### 1. Update Glass Tokens in `theme.ts`

We will increase the opacity of `colors.glass.background` to provide enough contrast for text without needing a blurred background.

- **Rationale**: A higher opacity (0.85 - 0.9) ensures that the map details don't "bleed through" and make text unreadable.

### 2. Deprecate `SafeBlurView` for Map Overlays

All instances of `SafeBlurView` in `EventDetailSheet`, `POIMiniCard`, and `FloatingSearchBar` will be replaced with standard `View` components.

- **Rationale**: Removing the blur calculation overhead improves frame rates during sheet animations and map panning.

### 3. Universal Action Button Formula

Standardize all interactive circles (Share, Close, Call, etc.) using:

- **Background**: `theme.dark ? 'rgba(40, 40, 40, 0.8)' : 'rgba(255, 255, 255, 0.8)'`
- **Border**: `theme.dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'`
- **Shadow**: `theme.shadows.soft`
- **Rationale**: This formula provides a "floating" feel that is consistent with the system's design tokens.

## Risks / Trade-offs

- **[Risk] Visual Flatness** → **Mitigation**: Use subtle shadows and high-quality borders to maintain a sense of depth and hierarchy without relying on blur.
- **[Risk] Contrast Issues** → **Mitigation**: Test the new 0.9 opacity against complex map areas (e.g., high-density urban areas) to ensure legibility.
