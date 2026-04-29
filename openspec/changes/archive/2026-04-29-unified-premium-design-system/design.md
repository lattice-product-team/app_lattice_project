## Context

The current mobile application uses a mix of local styles and hardcoded color values. While the Auth flow has a "Premium Dark" theme, it was implemented using ad-hoc components and gradients that aren't shared with the rest of the app. This creates a maintenance burden and a fragmented user experience.

## Goals / Non-Goals

**Goals:**
- Centralize all color primitives into a single `colors.ts` with distinct naming for the Midnight palette.
- Implement a semantic token layer in `theme.ts` that maps to primitives based on the active theme.
- Refactor core UI components to use the semantic layer exclusively.
- Establish a "Midnight Glass" standard for translucency.

**Non-Goals:**
- Implementing a user-facing theme toggle in this phase (the app will default to Midnight for now, but the *infrastructure* will support both).
- Modifying non-UI map elements (tiles, markers).

## Decisions

### 1. Primitives vs. Semantics
- **Decision**: Split `colors.ts` into `primitives` (raw hex) and `theme` (semantic tokens).
- **Rationale**: Decouples the brand colors from their usage in the UI. Allows for easier adjustments to the palette without touching every component.

### 2. Midnight Glass Specification
- **Decision**: Define `glass.midnight` as `rgba(22, 22, 24, 0.85)` with a high-intensity blur and a sRGB-linear gradient border.
- **Rationale**: Provides a deeper, more "premium" feel than simple black translucency. The subtle border prevents the sheet from bleeding into the background.

### 3. Solar Gold as the "Brand" Accent
- **Decision**: Retain Solar Gold (`#EFB33F`) as the primary interactive color across both themes.
- **Rationale**: Ensures brand recognition remains high regardless of the background luminance.

## Risks / Trade-offs

- **[Risk]** Breaking existing light-themed pages during refactor. → **Mitigation**: Implement the Light theme tokens first, ensuring they map to current values, before rolling out Midnight system-wide.
- **[Risk]** Performance impact of high-intensity blurs on older devices. → **Mitigation**: Use `useNativeBlur={true}` and ensure `SafeBlurView` is optimized.
