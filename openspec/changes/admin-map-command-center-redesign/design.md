## Context

The current `GlobalOperationsPage` uses a fragmented UI where navigation, headers, and event layers are separate floating cards. This layout blocks significant portions of the map and lacks a cohesive "command center" feel. The `AdminMap` component already supports various modes and layers but needs architectural refinement to handle native labeling and better integration with a sidebar-driven layout.

## Goals / Non-Goals

**Goals:**
- Implement a unified "Command Dock" (top bar) for search and status.
- Implement a collapsible sidebar for layer management and core navigation.
- Use MapLibre `SymbolLayer` for persistent, zoom-dependent event labels.
- Fix map occlusion issues caused by floating nav/logout components.

**Non-Goals:**
- Rewriting the `AdminMap` core rendering engine.
- Modifying backend telemetry or event data structures.
- Changing the aesthetics of the Events or POIs management pages.

## Decisions

### 1. Unified Shell Architecture
- **Decision**: Wrap the map in a layout shell that includes the top Command Dock and left Sidebar.
- **Rationale**: This provides a stable frame for UI controls that doesn't "float" over interactive map areas, solving the occlusion problem.
- **Alternatives**: Keeping floating cards but using smaller icons (rejected as it doesn't solve the core usability issue of blocking map area).

### 2. Collapsible Sidebar for Operations
- **Decision**: Move the "Active Layers" (event toggles) to a left-side panel that can be collapsed to a slim icon-only state.
- **Rationale**: Frees up horizontal space while keeping controls accessible.
- **Implementation**: Use a React state to toggle between `expanded` and `collapsed` states, affecting the `main` container's grid/flex layout.

### 3. Native Symbol Layers for Labeling
- **Decision**: Add a `SymbolLayer` to the `AdminMap` that sources event names from the GeoJSON feature properties.
- **Rationale**: Text rendered directly by the map engine is more performant and respects map rotation/zoom better than React-based HTML overlays.
- **Implementation**: Update `allBoundariesGeoJSON` to include event names in properties and add a `Layer` of type `symbol` in `AdminMap.tsx`.

### 4. Search-Driven Map Interaction
- **Decision**: Implement a search bar in the Command Dock that filters the `events` list and triggers `flyTo` and selection on the map.
- **Rationale**: Centralized search is the fastest way for administrators to navigate a large global map.

## Risks / Trade-offs

- **[Risk] Sidebar Occlusion on Mobile** → **Mitigation**: Sidebar will be a full-screen drawer on mobile or hidden by default.
- **[Risk] Map Performance with many Labels** → **Mitigation**: Use MapLibre's built-in collision detection and zoom-level filtering (`minzoom`) for labels.
