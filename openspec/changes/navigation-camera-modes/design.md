## Context

The Lattice mobile application relies on MapLibre React Native for high-performance map rendering. However, the camera orchestrations are currently static. Specifically, `<MapLibreGL.Camera>` is configured with `followUserLocation={false}` and `followUserMode={UserTrackingMode.None}`. During active navigation, this prevents the camera from centering on the user or rotating in the direction of travel/heading. When a route is panned or explored, there is no easy mechanism to reset the camera locks.

This design introduces dynamic camera state-binding to seamlessly switch between active user-tracking and free exploration, aligned with user-initiated actions and button gestures.

## Goals / Non-Goals

**Goals:**
- Dynamically control map camera location tracking and rotation in navigation.
- Decouple camera lock immediately when a user manual pan, zoom, or rotate gesture is detected.
- Implement an automatic cinematic `flyTo` transition to the user's location when route planning begins.
- Support a floating interactive recenter button to re-engage active tracking.

**Non-Goals:**
- Altering the route-calculation logic or path networks.
- Modifying offline tile packaging or general map styles.

## Decisions

### 1. Dynamic Binding of MapLibre Camera Props
- **Option A (Static Camera Hacks):** Programmatically calling `setCamera` on interval ticks to follow the user.
  - *Trade-offs*: Heavy CPU load, laggy transitions, and jittery orientation changes.
- **Option B (Dynamic Props - Selected):** Bind `followUserLocation` and `followUserMode` to reactive variables (`isFollowActive`, `trackingMode`) derived from `isNavigating` and ZUSTAND's `cameraMode`.
  - *Rationale*: Leverages MapLibre's highly optimized, GPU-accelerated C++ positioning system, producing perfectly fluid navigation cameras.

### 2. Immediate Gesture Decoupling
- **Design**: In `MapContent.tsx`'s camera movement handler (`handleCameraChange`), intercept `isUserInteraction === true`. If the camera is not already `FREE` and is not currently performing a programmatic route animation (`isProgrammaticMove === false`), set `cameraMode` to `FREE`.
  - *Rationale*: Allows users to instantly look around, browse, or pinch-zoom the map without fighting an automated camera lock-on.

### 3. Smart Recenter Action
- **Design**: Tapping the "Recenter" button calls `triggerRecenter()`, which sets `cameraMode` to `FOLLOW_WITH_HEADING`. This dynamically toggles `<MapLibreGL.Camera>`'s `followUserLocation` to `true` and centers/rotates the camera smoothly.

## Risks / Trade-offs

- **Risk: Camera Jitter on Position Updates** → *Mitigation*: MapLibre's built-in interpolation smoothly glides the camera between GPS points; we set `animated={true}` on the UserLocation layer.
- **Risk: Gesture Breakage During Programmatic Movements** → *Mitigation*: The `isProgrammaticMove` flag locks out gesture-breaking during automated camera snaps (like initial route fitting or recentering).
