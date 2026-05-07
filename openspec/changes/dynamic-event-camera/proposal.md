## Why

Selecting an event currently uses a fixed zoom level or a basic fit-bounds logic that doesn't always account for the specific spatial extent of the event. This can lead to either being too zoomed in (missing the context of the event's area) or too zoomed out (making POI names and icons illegible). We need a camera system that "understands" the event's boundaries and adjusts itself to provide the best balance between area visibility and content legibility.

## What Changes

- **Boundary-Aware Camera**: The map camera will now use the `boundary` property of a `LatticeEvent` to determine the viewport limits.
- **Smart Fit-Bounds Logic**: Instead of a simple fit, we will implement a logic that calculates the optimal bounding box but respects a "legibility floor" (minimum zoom level) to ensure labels remain readable.
- **Padding Standardization**: Universal padding constants will be applied to event-selection camera movements to leave clear space for the Discovery Island and other UI overlays.

## Capabilities

### New Capabilities
- `event-boundary-camera`: Implements the math and camera triggers to adapt the viewport to event polygons and their children POIs.

### Modified Capabilities
- `map-camera-logic`: Update existing camera manager to prioritize `boundary` data over simple point centering.

## Impact

- `apps/mobile/src/features/map/components/MapCameraManager.tsx`: Primary logic implementation.
- `apps/mobile/src/utils/geoUtils.ts`: Added helper for calculating BBox from polygons.
- `apps/mobile/src/types/index.ts`: Verification of `LatticeEvent` boundary types.
