## Context

The current "Island" UI is a bottom-mounted sheet that expands upwards. This design is being inverted to a top-mounted "dropdown" style interface to improve reachability and clear the bottom of the screen for future features.

## Goals / Non-Goals

**Goals:**
- Migrate the `islandContainer` to the top of the screen.
- Reverse gesture direction (Down = Expand, Up = Collapse).
- Maintain existing 3-level snap point logic (Level 1, 2, 3).
- Update visual tokens (handle, border radius) for top-down orientation.

**Non-Goals:**
- Changing the content of the DiscoveryDashboard or SearchExperience.
- Adding the "new page" mentioned by the user (out of scope for this phase).

## Decisions

### 1. Top-Down Coordinate System
- **Decision**: Use `top` positioning instead of `bottom` for the `islandContainer`.
- **Rationale**: Simplifies layout logic for a top-down dropdown.
- **Alternatives**: Keeping `bottom` positioning with negative height/translate logic, but this is more error-prone.

### 2. Gesture Inversion
- **Decision**: Update `stateDelta` calculation in the Pan gesture to use `event.translationY / fullTravel` (positive delta).
- **Rationale**: Downward movement now represents an increase in "state" (expansion).

### 3. Handle and Visual Hierarchy
- **Decision**: Move the "handle" (drag indicator) from the top of the island to the bottom.
- **Rationale**: The bottom edge is now the "leading edge" that users interact with to pull the sheet down.
- **Visuals**: Border radius will be fixed at 32px for top corners, but dynamic for bottom corners depending on expansion level.

### 4. AdaptiveControlOverlay Repositioning
- **Decision**: Evaluate the `AdaptiveControlOverlay` (3D, Recenter buttons). Currently they are pinned to the bottom right and move with the island.
- **Design Choice**: They will remain bottom-pinned but their `translateY` logic must be detached from the new top-island height to avoid jumping to the top.

## Risks / Trade-offs

- **[Risk] Status Bar Overlap** → **Mitigation**: Use `useSafeAreaInsets` to ensure the Level 1 (compact) state sits below the notch/status bar.
- **[Risk] Gesture Conflicts** → **Mitigation**: Ensure the Pan gesture doesn't conflict with the ScrollView inside the island (using `isScrollAtTop` logic similar to current implementation).
