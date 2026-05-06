## Context

The mobile application's map component (`MapContent` and `MapCameraManager`) currently initializes with a hardcoded Madrid coordinate (`MAP_CENTER`). Although `useLocationService` asynchronously fetches the user's location and updates the store, the `MapLibreGL.Camera` component's `defaultSettings` are only applied during the initial mount. This causes a visible "jump" from Madrid to the user's actual location once the asynchronous coordinate update arrives.

## Goals / Non-Goals

**Goals:**
- Eliminate the initial "jump" from Madrid by providing the user's last known location synchronously at mount time.
- Implement persistent storage for the user's location in `useLocationStore`.
- Ensure `MapCameraManager` uses the persisted location as its primary source for initial coordinates.

**Non-Goals:**
- Change the core map engine or location tracking logic.
- Implement complex geofencing or background tracking optimizations beyond basic persistence.

## Decisions

### 1. Persistent Location Store
**Decision:** Use `zustand/middleware/persist` with `react-native-mmkv` to store the `coords` and `logicalCoords` in `useLocationStore`.
**Rationale:** MMKV provides high-performance, synchronous storage. By persisting the location state, the coordinates will be available immediately when the store is initialized during app startup, allowing the map to render at the correct position on the first frame.
**Alternatives:** 
- `AsyncStorage`: Too slow, as it is asynchronous and might not be ready before the first render.
- Passing coordinates as initial props: Adds complexity to the routing layer and might not be consistent across different app entries.

### 2. Map Camera Initialization
**Decision:** Update `MapCameraManager.tsx` to prioritize `userCoords` in the `defaultSettings` of the `MapLibreGL.Camera` component.
**Rationale:** The `defaultSettings` prop is the correct way to set the initial camera state without triggering an animated transition. By ensuring `userCoords` is populated from the persisted store, the map will "start" at the user's last known location.

### 3. Fallback Mechanism
**Decision:** Keep `MAP_CENTER` (Madrid) only as a final fallback if no persisted location or current location is available.
**Rationale:** Provides a safe default if the user has never opened the app or has denied location permissions.

### 4. Layered Blur Architecture
**Decision:** Refactor `EventDetailSheet` and `POIMiniCard` to use a dedicated `SafeBlurView` as an absolute sibling layer behind the content.
**Rationale:** The current "wrapper" pattern often causes visual clipping and less intense blur effects when animating or scrolling. By moving the blur to a dedicated background layer (as seen in `AdaptiveControlOverlay`), we ensure maximum visual fidelity and prevent internal content from interfering with the frosted glass effect.
**Alternatives:** 
- Keep wrapper pattern: Easiest but results in inferior visual quality.
- Use native `backdrop-filter` (CSS): Not available in React Native.

## Risks / Trade-offs

- **[Risk] Stale Location**: The app might initialize at a location where the user was hours or days ago.
- **[Mitigation]**: `useLocationService` will still run its fast `getLastKnownPositionAsync` and regular updates upon mount, correcting the position quickly. Starting at a "stale" but local position is visually preferable to starting in a different country (Madrid).
- **[Risk] Privacy**: Storing coordinates on disk.
- **[Mitigation]**: The app already requires location permissions. MMKV storage is private to the application.
