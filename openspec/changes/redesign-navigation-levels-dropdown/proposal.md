## Why

To modernize the app's navigation and discovery experience by moving the primary interaction hub (the Island) to the top of the screen. This repositioning improves ergonomics for one-handed map exploration and prepares the layout for future feature additions at the bottom of the screen.

## What Changes

- **Reposition Island**: Move the `islandContainer` from its current bottom-pinned position to the top of the screen.
- **Invert Expansion Direction**: Redesign the gesture and animation logic so the island expands downwards from the top (Level 1 -> Level 2 -> Level 3) instead of upwards from the bottom.
- **Visual Orientation**: 
  - Adjust the "handle" position to the bottom of the island.
  - Update border radii to apply to the bottom corners when partially expanded, and maintain a floating card aesthetic.
- **Coordinate System Shift**: Update all interpolation and spring logic to use top-relative offsets and safe area insets from the top.
- **Interaction Logic**: Ensure that "dragging down" expands the search/discovery experience, while "dragging up" collapses it.

## Capabilities

### New Capabilities
- `top-navigation-island`: Implementation of the top-down discovery and search interface, including gesture-driven expansion and level snapping.

### Modified Capabilities
- `map-discovery-platform`: Change the "Permanent Island UI" requirement to specify a top-mounted position and downward expansion behavior.

## Impact

- `apps/mobile/app/(main)/index.tsx`: Core layout and animation logic for the main screen.
- `apps/mobile/src/features/map/components/DiscoveryDashboard.tsx`: May need layout tweaks for top-down orientation.
- `apps/mobile/src/features/map/components/AdaptiveControlOverlay.tsx`: Re-evaluate side controls positioning to avoid overlap with the new top island.
- `apps/mobile/src/components/ui/FloatingSearchBar.tsx`: Visual adjustments for top-mounted context.
