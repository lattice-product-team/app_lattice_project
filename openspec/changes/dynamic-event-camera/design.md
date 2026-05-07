## Context

The user requested a simpler, more consistent camera behavior: instead of varying zoom based on complex area calculations, we should use a "Standard Distance" where POIs are fully rendered and legible.

## Goals / Non-Goals

**Goals:**
- Use a "Standard Gold Zoom" (17.2) for event centering.
- Ensure all POIs within the event have 100% visible labels at this zoom.
- Centering on the event's centroid (geometric center).

**Non-Goals:**
- Complex BBox-fitting for oversized events (we prioritize legibility).

## Decisions

### 1. The Lattice Standard Zoom (17.2)
We will standardize event selection zoom to **17.2**. This level provides the best balance between seeing the immediate surroundings of a POI and maintaining high label legibility.

### 2. Label Visibility Calibration
Currently, `MapLayers.tsx` hides labels until zoom 17.5. This is too high for our new standard.
- **Decision**: Update `poisLabel` minZoomLevel to **16.0**.
- **Decision**: Update `textOpacity` interpolation to reach 1.0 at zoom **17.0**.
- **Decision**: Enable `textAllowOverlap: true` for POI labels to ensure all event POIs are visible even in dense areas.

### 3. Centroid Centering
Instead of just using a single coordinate point, if an event has a `boundary` polygon, we will calculate its **centroid** and center the camera there. If no boundary exists, we fallback to the event's primary point.

## Risks / Trade-offs

- **[Trade-off]**: Elongated events (like a long track) won't be fully visible at 17.2. However, the user is immediately in "interaction mode" where they can read names, which is the primary goal. They can pan manually to see the rest.
