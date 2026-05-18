## Context

The current UI state management in the mobile app is fragmented between React state and Reanimated shared values. This leads to:

- Excessive re-renders when dragging overlays.
- React render warnings for accessing `.value` during render.
- Messy, hard-to-maintain visibility conditions for HUD elements.

## Goals / Non-Goals

**Goals:**

- **Hierarchy Cleanup (Step 0)**: Refactor `index.tsx` to have a flat, predictable JSX structure for all overlays.
- Eliminate animation lag by moving visibility logic to the UI thread.
- Standardize the 3-level (top) and 2-level (bottom) sheet architecture.
- Implement automatic HUD button fade-out (Option B) for cleaner visuals.
- Centralize layer management to handle exclusive full-screen modes.

**Non-Goals:**

- Redesigning the internal content of the sheets (Dashboard/Search/Profile).
- Changing the underlying navigation library (Expo Router).

## Decisions

### 1. Centralized UI State Manager (UI_LAYER)

We will introduce a `UI_LAYER` shared value that acts as the "Source of Truth" for which overlay is currently active.

- **Rationale**: Prevents React re-renders when switching modes. Components can react to this value using `useAnimatedStyle`.
- **Alternatives**: Using a standard React Context (Rejected due to render overhead during animations).

### 2. HUD Visibility Controller (The "Fade-out" Logic)

Instead of conditional rendering, HUD buttons will have their opacity driven by a combination of `UI_LAYER` and the current sheet height.

- **Logic**: `opacity = withTiming(shouldHide ? 0 : 1, { duration: 150 })`.
- **Triggers**: Fade out if any bottom sheet is at Level 1 or 2, or if Top Island is at Level 3.

### 3. Reactive Level Collapsing

When `UI_LAYER` switches to a bottom sheet (Profile/Details), an `useAnimatedReaction` will trigger a collapse of the Top Island to Level 1.

- **Rationale**: Keeps the UI clean and focused on the active task.

### 4. Transparency Transitions (ST vs NT)

Background styles for overlays will use `interpolateColor` and `interpolate` (opacity) based on the level.

- **Level 1/2**: `backgroundColor: theme.colors.glass.background`.
- **Level 3**: `backgroundColor: theme.colors.bg.surface` (Non-Transparent).

## Risks / Trade-offs

- [Risk] Complex dependency chain between shared values. → [Mitigation] Use a centralized hook or custom store to manage the values and avoid circular reactions.
- [Risk] Component lifecycle issues (unmounting vs hiding). → [Mitigation] Keep core overlays mounted but set `pointerEvents="none"` and `opacity: 0` when inactive.
