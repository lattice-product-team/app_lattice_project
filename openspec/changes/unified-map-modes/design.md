## Context

The current map feature in the mobile app manages its state across three primary stores: `useMapUIStore`, `useNavigationStore`, and `usePOIStore`. This fragmentation leads to scenarios where multiple `useEffect` hooks in `MapCameraManager` and `MapContent` trigger competing camera animations. On Android, this frequently results in the camera engine getting "stuck" or jittering.

## Goals / Non-Goals

**Goals:**

- Establish a single `AppMode` state that controls both UI layers and camera behavior.
- Eliminate camera "fighting" by centralizing transition logic.
- Fix Android camera lockups using a resilience protocol.
- Improve performance by reducing redundant re-renders during camera movement.

**Non-Goals:**

- Replacing `@maplibre/maplibre-react-native`.
- Modifying the visual design of the existing sheets or markers (logic only).
- Refactoring the backend geo-services.

## Decisions

### 1. Unified State Machine

We will promote `MapUIState` (in `useMapUIStore`) to be the master `AppMode`.

- **Actions**: When a mode is set (e.g., `setUIState(NAVIGATING)`), the store will be responsible for cleaning up conflicting states in other stores (e.g., calling `setSelectedPoi(null)` in `usePOIStore`).
- **Derived Visibility**: UI components like `DiscoveryDashboard` and `AdaptiveControlOverlay` will use this single state for visibility logic.

### 2. Centralized Camera Transition Manager

Instead of `MapCameraManager` having separate `useEffect` hooks for every coordinate change, it will use a centralized transition handler.

- **Approach**: A single `useAnimatedReaction` or a `useEffect` that monitors the `uiState` transition.
- **Resilience**: Every transition will begin with a "Safety Reset":
  ```typescript
  cameraRef.current.setCamera({
    animationDuration: 0,
    padding: { paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0 },
  });
  ```
  This clears the native engine's "goal" state, allowing the next animation to start from a clean slate.

### 3. Separation of Concerns for MapLayers

`MapLayers` will be refactored to focus purely on rendering GeoJSON data based on the current mode, while `MapCameraManager` handles the viewport. This reduces the size and complexity of `MapContent.tsx`.

### 4. Platform-Specific followUserMode

- **Android**: Use `compass` mode to ensure the map rotates with the user's orientation during navigation.
- **iOS**: Use `course` mode for smoother directional alignment.

## Risks / Trade-offs

- **[Risk] State Synchronization Loops** → **[Mitigation]** Ensure store actions are idempotent and avoid circular calls between `useMapUIStore` and `useNavigationStore`.
- **[Risk] Breaking Sheet Animations** → **[Mitigation]** Keep the `islandState` and `sheetPosition` shared values but drive their targets from the unified mode changes.
- **[Risk] Android Performance Overhead** → **[Mitigation]** Continue using `CircleLayer` for background POIs and only promote the selected item to a `PointAnnotation`.
