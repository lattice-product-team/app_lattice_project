# Design: AR Event Exploration

## Architecture Diagram

```
┌─────────────────┐       ┌──────────────────┐
│  Map UI Store   │       │     AR Store     │
│ (selectedEvent) │       │ (filterMode)     │
└────────┬────────┘       └────────┬─────────┘
         │                         │
         ▼                         ▼
┌────────────────────────────────────────────┐
│              AROverlay (Main)              │
│  - Permission Handling                     │
│  - Orientation Lock (Portrait)             │
│  - Camera Feed (expo-camera)               │
└────────┬─────────────────────────┬─────────┘
         │                         │
         ▼                         ▼
┌──────────────────┐       ┌──────────────────┐
│   MainARScene    │       │      ARHUD       │
│  (Three.js/Fiber)│       │ (2D UI Overlay)  │
│  - 3D Pins       │       │ - Distance/Name  │
└──────────────────┘       └──────────────────┘
```

## Data Filtering Strategy

### Global Exploration (Binoculars)
1. `filterMode = CLOSEST_EVENT`
2. `useARData` hook:
    - Get current user location.
    - Fetch all events.
    - Calculate distance to each event centroid.
    - Select event with minimum distance.
    - Fetch and render all pins for that event.

### Event Specific View (Use AR button in Event Sheet)
1. `filterMode = SELECTED_EVENT`
2. `targetId = eventId`
3. `useARData` hook:
    - Fetch and render all pins for `eventId`.

### Specific Pin Tracking (Use AR button in POI Sheet)
1. `filterMode = SPECIFIC_PIN`
2. `targetId = poiId`
3. `useARData` hook:
    - Fetch and render only the pin with `poiId`.

## Technical Details

### Orientation Lock
Use `expo-screen-orientation` to lock the UI to `OrientationLock.PORTRAIT_UP` when `isVisible` is true. Unlock when false.

### Real-time Heading
Use `expo-location.watchHeadingAsync` to update the `heading` in `useOrientationStore`. This drives the rotation of the 3D scene and 2D projections.

### Pin UI
- **3D:** Subtle white dots with glow (Lattice aesthetic).
- **2D Projection:** Bubble with icon, name, and distance.
    - `xPos = (angleDiff / (FOV/2)) * (width/2) + width/2`
    - `yPos = height/2 + staggeredOffset`

### Permisos
Graceful handling of Camera and Location permissions. If missing, show a high-quality "Permission Needed" view with a clear CTA.
