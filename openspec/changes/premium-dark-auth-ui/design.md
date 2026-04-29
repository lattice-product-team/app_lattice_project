## Context

The current `ThemeGradient` and `PremiumButton` components are biased towards light themes. The "premium" variant of the gradient is nearly white (`#FFFFFF`), which clashes with the "white" variant of the button. We need a way to support high-contrast dark backgrounds for specific sections of the app.

## Goals / Non-Goals

**Goals:**
- Create a reusable "midnight" theme configuration.
- Standardize button variants for dark backgrounds.
- Enable native blur effects for "glass" variants.

**Non-Goals:**
- Implementing a full system-wide dark/light mode toggle (out of scope for this change).
- Redesigning the main map interface (only focusing on Auth).

## Decisions

### 1. New `midnight` variant for `ThemeGradient`
- **Decision**: Add a new variant that uses a gradient from `#0F172A` (Slate 900) to `#000000` (Pure Black).
- **Rationale**: This provides the deep contrast needed for the Solar Gold (`#EFB33F`) to pop.

### 2. Update `PremiumButton` primary variant for Dark backgrounds
- **Decision**: When in a dark context, the primary button will always use the Solar Gold gradient with black text.
- **Rationale**: Highest possible accessibility and brand recognition.

### 3. Native Blur for Secondary Actions
- **Decision**: Use the recently stabilized `SafeBlurView` (with `useNativeBlur = true`) for secondary glass buttons.
- **Rationale**: Creates a sophisticated, high-end feel that differentiates the app from standard flat designs.

## Risks / Trade-offs

- **[Risk]** Text color inconsistency. → **Mitigation**: Standardize `AuthLayout` to use white/silver text variants when the background is dark.
