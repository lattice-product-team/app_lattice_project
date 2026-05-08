## Context

The `EventDetailSheet` is a Reanimated-driven bottom sheet. Its visibility is controlled by a central `uiLayer` shared value. Currently, it has a "sync reaction" that forces the sheet to the `MID` position whenever the `uiLayer` is in the `EVENT` state. This prevents the user from successfully snapping to the `FULL` position. Additionally, closing the sheet via the "X" button immediately clears the `selectedEvent` state in React, causing the component to unmount or reset before the exit animation can play.

## Goals / Non-Goals

**Goals:**
- Enable stable transition between `MID` and `FULL` snap points.
- Implement a "wait-for-finish" exit animation strategy.
- Improve animation feel via tuned spring constants.

**Non-Goals:**
- Redesigning the sheet content or UI components.
- Changing the `uiLayer` state machine logic.

## Decisions

### 1. Guarded State Synchronization
Instead of unconditionally springing to `MID` when `externalState` is active, we will only trigger the entrance animation if the sheet is currently in the `HIDDEN` (0) state.
- **Rationale**: This allows the initial entrance to be automated while preventing subsequent global state updates from overriding manual user positioning (MID vs FULL).

### 2. Async Close Pipeline
The `onClose` prop will be called as a callback to a `withSpring(0)` animation.
- **Implementation**: Wrap the `onClose` call in the animation completion callback of `islandState.value = withSpring(0, ...)`.
- **Alternative**: Using React state for visibility. Rejected because it introduces lag and breaks the "Pure UI" principle of the current architecture.

### 3. Spring Configuration Update
Replace the `liquidSpring` with a more standard but polished configuration.
- **New Config**: `damping: 20, stiffness: 90, mass: 1`.
- **Rationale**: Provides a snappier response that feels less "mushy" than the current high-mass spring.

## Risks / Trade-offs

- **[Risk] Delayed State Sync** → If the animation gets stuck, the React state might remain "selected" even if the sheet is visually gone.
- **[Mitigation]** → Add a safety timeout or ensure the `onClose` is also reachable via a direct `useEffect` cleanup if the component unmounts unexpectedly.
