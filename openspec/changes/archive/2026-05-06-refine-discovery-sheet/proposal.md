## Why

The main discovery sheet (Island UI) has several UX friction points:

1. Level 3 (Full Screen) often shows a legacy "Select point" placeholder instead of useful search content.
2. Level 3 lacks intuitive drag-down interaction from the content area (blocked by ScrollView).
3. Gesture physics are too sensitive/fast, lacking a premium "heavy" feel.
4. Periodic frame drops during transitions.

## What Changes

- **Level 3 Content Overhaul**: Replace the legacy placeholder with a "Quick Search" view featuring recent searches and nearby categories when no active search query exists.
- **Gesture Synchronization**: Implement `SimultaneousHandlers` between the Sheet Pan Gesture and the Internal ScrollView to allow dragging the sheet down from any point when the scroll is at the top.
- **Physics Tuning**: Re-tune `withSpring` parameters (stiffness/damping) to achieve a more natural, fluid, and premium motion.
- **Performance Optimization**: Refactor animated styles to use fewer color interpolations and ensure all animations run on the UI thread.

## Capabilities

### Modified Capabilities

- `map-discovery-platform`: Update interaction requirements for the Level 3 state.
- `premium-sheet-interaction`: New requirements for gesture physics and scroll-synchronization.

## Impact

- **app/(main)/index.tsx**: Core logic for the sheet and gestures.
- **SearchExperience.tsx**: Content display logic for Level 3.
- **DiscoveryDashboard.tsx**: Layout adjustments for better transitions.
