## Why

The `EventDetailSheet` currently exhibits two major UX issues:
1. **Bouncing**: When a user attempts to drag the sheet to full-screen (Level 2), it often bounces back to mid-height (Level 1) due to a state conflict between the local gesture state and the global `uiLayer` synchronization.
2. **Abrupt Closing**: Tapping the close button or dragging down results in an unnatural, fast disappearance without a proper exit animation, making the UI feel "choppy".

## What Changes

- **Synchronized State Transition**: Refactor the `useAnimatedReaction` in `EventDetailSheet` to prevent it from forcing the sheet back to `MID` when the user is explicitly dragging it to `FULL`.
- **Exit Animation Pipeline**: Modify the `onClose` logic to trigger a controlled `withSpring(0)` animation and only call the React-side cleanup (e.g., `setSelectedEvent(null)`) AFTER the animation completes.
- **Physics Tuning**: Update the `liquidSpring` configuration to use more natural damping and stiffness values (e.g., `damping: 25`, `stiffness: 90`).

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `pure-ui-animation-bridge`: Update the rules for how bottom-up sheets coordinate their internal state with the global `uiLayer` signal to support manual expansion and smooth exits.

## Impact

- `apps/mobile/src/features/map/components/EventDetailSheet.tsx`: Primary logic for snapping and reactions.
- `apps/mobile/app/(main)/index.tsx`: Callback logic for closing and state cleanup.
