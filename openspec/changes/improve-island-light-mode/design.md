## Context

The "Midnight Island" interface uses a glassmorphism aesthetic that relies on blur and semi-transparency. While this works well in dark mode with white accents, the light mode implementation is currently broken due to hardcoded white values that lack contrast against light backgrounds.

## Goals / Non-Goals

**Goals:**
- Achieve WCAG-compliant contrast for all text and icons in both light and dark themes.
- Maintain the premium "glass" aesthetic in light mode.
- Remove 100% of hardcoded color values from the affected components.

**Non-Goals:**
- Changing the layout or behavior of the island/HUD.
- Updating the map tiles or colors (handled by MapTiler styles).

## Decisions

- **Token-Driven Styling**: All colors must use `theme.colors`. For translucent backgrounds, we will use `theme.colors.glass.*` tokens.
- **Dynamic Blur Tint**: The `tint` prop of `SafeBlurView` (and its native `BlurView` counterparts) must be bound to `theme.colors.glass.tint` ('light' or 'dark').
- **Contrast Ramping**: For primary actions, use `theme.colors.text.primary`. For secondary or background icons (like category pills), use `theme.colors.text.secondary` with appropriate opacity from the theme.
- **Pill Backgrounds**: Instead of hardcoded RGBA, category pills will use `theme.colors.glass.subtle` for the background and `theme.colors.glass.subtleBorder` for the border, ensuring they look consistent across themes.

## Risks / Trade-offs

- **Risk**: Light mode glass might still feel too "washed out" if the background is very bright.
  - **Mitigation**: Increase the `intensity` of the blur in light mode if needed, or use a slightly darker `tint` for the glass background token in the theme.
- **Risk**: System theme changes might cause flickering if not handled efficiently.
  - **Mitigation**: Rely on the existing `ThemeProvider` which uses `useMemo` to stabilize the theme object.
