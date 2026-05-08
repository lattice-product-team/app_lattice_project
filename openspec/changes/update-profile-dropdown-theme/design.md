## Context

The current user profile is a standard full-screen screen (`apps/mobile/app/(main)/profile.tsx`). The app's navigation is moving towards a "Floating Island" architecture where secondary information (like discovery or profile) is revealed through sheet levels. "Nivel 2" refers to the half-expanded state (approx. 0.5 shared value) of the main interactive island.

## Goals / Non-Goals

**Goals:**
- Replace the static profile screen with an interactive dropdown component.
- Match the visual style of the reference image (Gamified Stats, centralized avatar, Level progress).
- Integrate with the `islandState` logic to allow fluid transitions between "Closed" and "Profile" (Nivel 2) states.
- Support "Settings" and "Close" actions within the dropdown.

**Non-Goals:**
- Implement the "Nivel 3" (Full Screen) state for the profile in this phase.
- Change the core `useAuthStore` or `useProfileStore` data structures.
- Redesign the global navigation menu (Tabs).

## Decisions

- **Architecture: Independent Sheet Layer**: Instead of being a content overlay *inside* the main island, the `ProfileSheet` will be a standalone component similar to `EventDetailSheet`. It will have its own `islandState` (SharedValue) and `GestureDetector`.
- **Z-Index & Layering**: The `ProfileSheet` will be rendered above the `InteractiveIsland` in the main `index.tsx` component tree.
- **Main Island Coordination**: When `isProfileOpen` is true, the main `islandState` will be animated to 0 (collapsed) to clear the space for the profile sheet.
- **State Management**: 
    - `isProfileOpen` (Boolean) to control the mount/trigger state.
    - Local `sheetState` (SharedValue) within `ProfileSheet` to handle the 0 -> 0.5 -> 1.0 transitions.
- **Component Decomposition**:
    - `ProfileSheet`: The overlay container with sheet physics.
    - `ProfileContent`: The actual redesigned UI (Avatar, Progress, Stats).
- **Navigation Redirect**: `apps/mobile/app/(main)/profile.tsx` will be refactored to trigger the dropdown expansion on the map screen rather than rendering its own content, ensuring a single source of truth for the profile UI.

## Risks / Trade-offs

- **[Risk] State Conflict**: The island might be used for discovery and profile simultaneously. 
    - **Mitigation**: Implement a priority system or a `currentIslandContent` state (e.g., 'none' | 'discovery' | 'profile').
- **[Risk] Performance**: Multiple Reanimated components listening to the same `islandState` might cause lag on lower-end devices.
    - **Mitigation**: Use `React.memo` and ensure non-visible components have `pointerEvents="none"` and 0 opacity.
- **[Risk] Layout Overflow**: The gamified cards might not fit on smaller screens at 0.5 height.
    - **Mitigation**: Wrap content in a `ScrollView` if the calculated height exceeds the 0.5 threshold.
