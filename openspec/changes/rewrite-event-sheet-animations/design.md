## Context

The current conditional rendering logic (`{selectedEvent && <EventDetailSheet />}`) leads to race conditions where the JS thread unmounts the component while the UI thread is still processing a gesture or inertia scroll. This results in the "Sending onAnimatedValueUpdate with no listeners registered" warning and app crashes.

## Goals / Non-Goals

**Goals:**
- Zero-crash unmount strategy via persistent rendering.
- Perfectly mirrored physics with the search island.
- High-performance simultaneous gesture handling.

**Non-Goals:**
- Changing the content layout of the event details.

## Decisions

### 1. The "Ghost" Sheet Strategy
We will remove the conditional rendering from `index.tsx`. The `EventDetailSheet` will always be present in the view hierarchy.
- **Hidden State**: When `event` is null, `islandState` will animate to 0, which translates the sheet to `-SCREEN_HEIGHT`.
- **Pointer Events**: We will use `pointerEvents` orchestration to ensure the "hidden" sheet doesn't capture taps.

### 2. Derivative Animation State
`EventDetailSheet` will use a `useEffect` or `useAnimatedReaction` to watch its `event` prop. 
- When `event` becomes valid → Animate 0 -> 0.5.
- When `event` becomes null → Animate to 0.

### 3. Simultaneous Gesture Handler
To fix the "bouncing" or "fighting" between scroll and drag:
- Use `Gesture.Simultaneous(pan, native)` where `native` is the inner ScrollView.
- Implement a `waitFor` logic to ensure Level 2 expansion has priority over inner scrolling.

## Risks / Trade-offs

- **[Risk] Memory Leak** → Keeping one more component mounted.
- **[Mitigation]** → The component is lightweight (mostly a few views and texts). We will ensure that data fetching (`useEventDetails`) is gated by `event?.id` to avoid background network calls.
