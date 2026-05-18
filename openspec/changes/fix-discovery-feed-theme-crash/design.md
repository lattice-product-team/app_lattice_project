## Context

The `DiscoveryFeed` component currently crashes with a `TypeError` when accessing `theme.colors` because the `theme` object is `undefined`. This happens during the initial render where `isReady` is `false` (enforcing a skeleton view) and `useAppTheme()` has not yet returned a valid context value.

The application uses a persistent `lastScreenMode` to redirect users to "Explore" (index 0) on first launch or based on their previous session. This redirection happens quickly, potentially before the `ThemeProvider` context is fully propagated to all child components.

## Goals / Non-Goals

**Goals:**

- Eliminate the `TypeError: Cannot read property 'colors' of undefined` in `DiscoveryFeed`.
- Ensure the loading skeleton in `DiscoveryFeed` renders safely.
- Maintain the personalized greeting logic in the "Explore" header.
- Stabilize the app startup sequence to prevent safety timeouts.

**Non-Goals:**

- Refactoring the entire `ThemeProvider` architecture.
- Changing the overall navigation or redirection logic.

## Decisions

### 1. Pass Theme as a Prop to DiscoveryFeed

**Rationale**: `MapIndexPage` (the parent of `DiscoveryFeed`) already implements a robust theme resolution strategy, including a direct `require` fallback. By passing the resolved `theme` as a prop, we guarantee that `DiscoveryFeed` has access to the same stable theme object used by the rest of the main screen.
**Alternative**: Relying solely on `useAppTheme()` hook within `DiscoveryFeed`, but this has proven unstable during the initial mount phase.

### 2. Improve Safety Fallback in DiscoveryFeed

**Rationale**: Even with a prop, we should ensure the component never crashes. We will keep the `require` fallback but wrap the theme access in a way that is more resilient.
**Implementation**: Use `theme?.colors?.glass?.background || '#000'` as a last resort, though the prop-based approach should make this unnecessary.

### 3. Cleanup isReady State

**Rationale**: The `isReady` state was introduced to defer rendering, but it currently forces the component into a loading block that is the very source of the crash. We will ensure that this loading block is "theme-safe" or minimize its duration.

## Risks / Trade-offs

- **[Risk]** Prop Drilling → **[Mitigation]** The change only affects one level of nesting (`MapIndexPage` to `DiscoveryFeed`), which is acceptable for stability.
- **[Risk]** Redundant Fallbacks → **[Mitigation]** We will consolidate the fallback logic to ensure `DiscoveryFeed` and its parent use consistent theme data.
