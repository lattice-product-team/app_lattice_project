## Context

The mobile application's current performance is degraded by a "render storm" caused by high-frequency GPS updates. Each movement update triggers a re-render of the root `MainScreen`, which in turn forces heavy sub-components like `MapContent` to re-evaluate. Additionally, monolithic state descheduling in `useMapStore` causes components to re-render on unrelated state changes.

## Goals / Non-Goals

**Goals:**
- Eliminate root-level re-renders triggered by GPS updates.
- Decouple logical location (for routing/distance) from visual location (for map marker).
- Implement atomic state subscription patterns.
- Achieve stable 60fps performance during navigation and map exploration.

**Non-Goals:**
- Replacing the map library (MapLibre).
- Redesigning the UI/UX layout.
- Implementing background location tracking.

## Decisions

### 1. Unified Location Store (Zustand)
- **Decision**: Create a dedicated `useLocationStore` to hold coordinate data.
- **Rationale**: Moving location data out of `useState` prevents React from re-rendering components that are merely "hosting" the tracking logic. Components can subscribe surgically to coordinates only when they need to display them.

### 2. Atomic Selectors for Store Subscriptions
- **Decision**: Replace `const { x, y } = useStore()` with `const x = useStore(s => s.x)`.
- **Rationale**: This is the standard best practice for Zustand to ensure components only re-render when the specific properties they use actually change.

### 3. Prop-to-Store Migration for MapContent
- **Decision**: Remove `userCoords` and `locationStatus` props from `MapContent`. Instead, `MapContent` will use internal layers (like `MapLibreGL.UserLocation`) and subscribe to the `LocationStore` only for high-level logic.
- **Rationale**: Decoupling props allows the map component to remain memoized even when the user is moving, as long as the map data (POIs, routes) remains the same.

### 4. Distance-Based Throttling for Logical Updates
- **Decision**: Implement a "Significant Movement" threshold (e.g., 5-10 meters) in the location tracking hook.
- **Rationale**: High-frequency updates are only needed for the visual cursor (which MapLibre handles natively). Logical state updates (which trigger route recalculations or distance text updates) should only happen when a meaningful distance has been covered to save CPU and battery.

## Risks / Trade-offs

- **[Risk]** Delay in UI updates for distance/time-to-arrival. → **[Mitigation]** Tune the distance threshold carefully (e.g., 5m for walking).
- **[Risk]** Store complexity increases. → **[Mitigation]** Keep the `LocationStore` simple and focused strictly on raw coordinates and status.
