## Context

The Lattice mobile application is undergoing a transition to a premium "Midnight Glass" design system. While the core theme infrastructure exists in `src/styles/theme.ts`, many components still use hardcoded hex values or rgba strings. This fragmentation makes it difficult to maintain a consistent look across light and dark modes and prevents a truly adaptive UI.

## Goals / Non-Goals

**Goals:**

- Eliminate 100% of hardcoded color values in the `apps/mobile` codebase.
- Standardize the semantic token set to cover all UI needs (brand, background, text, status, interactive).
- Ensure all color usage follows professional UX principles (contrast, hierarchy).
- Update the "Midnight Glass" aesthetic to be more cohesive and premium.

**Non-Goals:**

- Redesigning the entire app layout or navigation.
- Implementing a completely different branding.
- Modifying backend APIs or data structures.

## Decisions

### 1. Unified Semantic Token Schema

We will expand the `LatticeTheme` interface to include a comprehensive set of tokens that cover interactive states and status indicators.

- **Rationale**: Currently, many components use hardcoded colors for things like "danger" or "pressed" states. Standardizing these in the theme allows for consistent behavior across the app.
- **Alternatives**: Keeping specific colors in components (rejected as it defeats the purpose of standardizing).

### 2. "Midnight Glass" Refinement

We will refine the glass effect tokens to better leverage translucency and blur, particularly for the dark theme.

- **Rationale**: To achieve a "premium" feel, glass elements need careful tuning of background opacity and border tints.
- **Decision**: Use `rgba` values derived from theme primitives but stored as tokens in `theme.ts`.

### 3. Automated Search & Manual Verification

We will use grep to find all hex/rgba strings and manually map them to the closest semantic token.

- **Rationale**: An automated replacement might misinterpret the intent of a color (e.g., a gray used for a border vs. a gray used for muted text).

## Risks / Trade-offs

- **[Risk] Visual Regressions** → Mitigation: Thorough manual verification of all screens after replacement.
- **[Risk] Performance (Re-renders)** → Mitigation: Ensure the theme object is memoized and components use standard React Native `StyleSheet.create` where possible, or high-performance styling libraries if applicable.
- **[Trade-off] Implementation Time** → Standardizing a large codebase takes time, but pays off in long-term maintainability.
