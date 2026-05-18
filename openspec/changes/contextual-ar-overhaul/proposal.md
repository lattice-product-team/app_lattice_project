## Why

The current AR implementation lacks contextual awareness, displaying generic pins regardless of the user's location relative to events. This creates visual clutter and fails to provide relevant information. By introducing a boundary-aware logic, we can offer a high-level overview of events when the user is distant and a detailed, POI-focused view when they are within an event's perimeter, significantly improving the spatial discovery experience.

## What Changes

- **Boundary-Aware AR Filtering**: Implementation of real-time check to determine if the user is inside an event's boundary (polygon).
- **Dual-Mode AR Visualization**:
  - **City-Scale Mode**: Shows large "Beacons" for events when the user is outside any boundary.
  - **Event-Scale Mode**: Shows detailed "Pins" for POIs only within the active event boundary.
- **Specific POI Tracking**: Support for tracking a single POI with a dedicated "Target" view.
- **Immersive AR UI**: Automatic hiding of the Map/Explore navigation and search bar when AR is active to provide a full-screen experience.
- **Contextual AR Access**: The "Use AR" button in POI details will now only be available if the user is within the event's boundary.

## Capabilities

### New Capabilities

- `contextual-ar-filtering`: Logic for switching AR modes based on user location relative to event polygons.
- `immersive-ar-ui-manager`: System for managing the visibility of non-AR UI components when the AR overlay is active.

### Modified Capabilities

- `event-poi-orchestration`: Updating how spatial data is filtered and passed to the AR scene based on boundary intersection.
- `event-detail-sheet`: Updating the conditional visibility and behavior of the "Use AR" action.
- `spatial-hierarchy-logic`: Incorporating boundary-in-polygon checks for mode switching.

## Impact

- **Mobile App**: `AROverlay`, `useARData`, `ARHUD`, and the main `index.tsx` screen will be modified.
- **Stores**: `useARStore` will be updated to handle more granular states.
- **Utils**: `geoUtils.ts` will need a ray-casting implementation for boundary checks.
- **Performance**: Constant boundary checks need to be efficient to maintain AR frame rates.
