## Why

The current `EventDetailSheet` implementation is plagued by interaction conflicts and unmount crashes. To achieve the premium feel of the top search island, we need to rebuild the animation logic using the same tri-state model and persistent mounting strategy. This will eliminate crashes and provide a cohesive UX across the entire application.

## What Changes

- **Persistent Mounting**: Modify `index.tsx` to keep the `EventDetailSheet` mounted but visually hidden (offset -SCREEN_HEIGHT) when no event is selected. This prevents unmount crashes during gesture completion.
- **Tri-State Animation Model**: Rebuild `EventDetailSheet` to strictly follow the 0 -> 0.5 -> 1.0 state progression used by the main UI island.
- **Physics Unification**: Explicitly use `theme.motion.physics.magnetic` and `snappy` for all transitions to ensure global consistency.
- **Gesture-Scroll Coordination**: Implement a more robust `Simultaneous` gesture strategy to prevent the inner ScrollView from fighting with the outer PanGesture during expansion.

## Capabilities

### New Capabilities

- None

### Modified Capabilities

- `pure-ui-animation-bridge`: Update the state machine to include a "Persistent Invisible" state for bottom-up sheets.

## Impact

- `apps/mobile/src/features/map/components/EventDetailSheet.tsx`: Complete rewrite of animation and gesture logic.
- `apps/mobile/app/(main)/index.tsx`: Change mounting logic and visibility coordination.
- `apps/mobile/src/features/map/components/MapLayers.tsx`: Ensure marker selection visuals sync with the new persistent model.
