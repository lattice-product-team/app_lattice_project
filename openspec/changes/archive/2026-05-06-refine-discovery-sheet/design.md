## Context

The current sheet implementation uses a single `GestureDetector` for the entire island, but the `ScrollView` inside the sheet consumes all touch events when enabled (Level 3). This creates a "dead zone" for dragging the sheet back down. Additionally, the spring physics are too light, leading to a "bouncy" but non-premium feel.

## Goals / Non-Goals

**Goals:**

- Enable intuitive "drag-down" behavior from Level 3 using `SimultaneousHandlers`.
- Improve perceived fluidity by using the `mass` property in spring animations.
- Eliminate the legacy "Select point" placeholder.
- Ensure Level 3 always has useful content (Search/Recent).

## Decisions

1. **Simultaneous Gestures**:
   - We will use `Gesture.Simultaneous(panGesture, nativeGesture)` on the sheet container.
   - We will implement a `useSharedValue` called `isScrollAtTop` updated by the ScrollView's `onScroll` event.
   - The `PanGesture` will only take control if `isScrollAtTop.value === true` and the user is dragging downwards.

2. **Spring Physics Refinement**:
   - We will switch to a "Heavy Fluid" config: `{ damping: 35, stiffness: 80, mass: 1.2 }`. This provides more inertia and feels more deliberate, similar to Apple's native sheets.

3. **Level 3 UI State Machine**:
   - Level 3 content will be controlled by a simple logic:
     - `if (selectedPoi) show POI details`
     - `else if (isSearching || islandState > 0.8) show SearchExperience`
     - `else show DiscoveryDashboard`

4. **Performance Tuning**:
   - Use `Extrapolation.CLAMP` on all interpolations to prevent "over-travel" of UI elements that might cause layout jumps.
   - Minimize the use of `interpolateColor` where possible, or limit its range.

## Risks / Trade-offs

- **Gesture Complexity** → [Risk] Overlapping gestures can sometimes lead to "stuck" states. [Mitigation] Use strict thresholds for the `isScrollAtTop` logic.
- **Battery Impact** → [Risk] High-frequency gesture handling. [Mitigation] Keep the `onUpdate` logic extremely lean, moving all derived logic to `useDerivedValue`.
