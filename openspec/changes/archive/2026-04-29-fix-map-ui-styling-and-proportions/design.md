## Context

The Lattice mobile app is transitioning to a theme-aware architecture. During this process, map components that previously relied on hardcoded dark-mode styles were partially refactored, leading to visibility issues in the light theme and layout instabilities in the bottom sheet.

## Goals / Non-Goals

**Goals:**

- Restore 100% visual fidelity of map filters and discovery carousels in both light and dark modes.
- Eliminate layout "squashing" of POI cards.
- Standardize the usage of the new `glass.subtle` tokens.

**Non-Goals:**

- Changing the underlying data fetching logic or state management.
- Redesigning the entire map experience (outside of styling/proportions).

## Decisions

### 1. Enhanced Subtle Glass Tokens

**Rationale**: The initial `glass.subtle` tokens in light mode were too transparent (4% opacity), making them invisible on white backgrounds.
**Choice**: Increase `lightTheme.colors.glass.subtle` to `rgba(0, 0, 0, 0.06)` and `subtleBorder` to `0.12`.

### 2. Explicit Height for Bottom Sheet Content

**Rationale**: `BottomSheetScrollView` can sometimes compress children if they don't have defined dimensions or if they use flexible layouts without constraints.
**Choice**: Set an explicit `minHeight` on `POICarousel` cards and ensure the `SearchFilters` wrapper has sufficient vertical padding.

### 3. Gap-based Layout for Filters

**Rationale**: `marginRight` on individual chips can be inconsistent if the parent container doesn't manage spacing centrally.
**Choice**: Use `gap: 12` in the `ScrollView` `contentContainerStyle` for `SearchFilters` where supported, or standardize on a consistent `marginRight` in `CategoryChip`.

## Risks / Trade-offs

- **[Risk]** Increasing glass opacity might make the UI look "heavy". → **Mitigation**: Use very small increments (e.g., from 0.04 to 0.06) and test against the real device background.
- **[Risk]** Fixed heights in the carousel might clip content on very small screens. → **Mitigation**: Use `Dimensions` to calculate safe heights or `aspectRatio` where possible.
