## Context

The current AR system operates on a "nearest event" or "manually selected" basis without spatial awareness of polygons. Data is fetched and rendered regardless of whether the user is actually at the venue or miles away. The UI also remains cluttered with standard navigation elements during AR exploration.

## Goals / Non-Goals

**Goals:**

- Implement a robust Point-in-Polygon (PiP) check for event boundaries.
- Orchestrate UI visibility (Search Bar, Mode Toggle) based on AR visibility.
- Enable automatic mode switching: Beacons (Global) vs Pins (Local).
- Filter data at the hook level based on the active contextual mode.

**Non-Goals:**

- Adding persistent navigation within AR.
- Implementing occlusion or depth-sensing AR (remains location-based).
- Modifying the 3D assets/models themselves (just their orchestration).

## Decisions

### 1. Point-in-Polygon Implementation

**Decision**: Use a Ray-casting algorithm in `geoUtils.ts`.
**Rationale**: High performance and no external dependencies (like Turf.js or Geolib) are required for a simple 2D polygon check. Since we are operating on a mobile device's UI thread (or near it in a hook), minimizing library overhead is key.
**Alternatives**:

- `turf-boolean-point-in-polygon`: Too large for just this use case.
- `geolib.isPointInPolygon`: Already checked, not in dependencies.

### 2. UI Orchestration

**Decision**: Bind UI element opacity to `useARStore.isVisible` using Reanimated's `useAnimatedStyle`.
**Rationale**: Provides smooth, frame-synchronized transitions. By putting the logic in the components themselves (Search Bar, Toggle), we maintain encapsulation.
**Alternatives**:

- `Conditional Rendering`: Too jarring (immediate pop-out/in).

### 3. Data Flow

**Decision**: Enhance `useARData.ts` to compute the "active event context" by iterating through all events and checking boundaries.
**Rationale**: Centralizes the logic. If multiple boundaries overlap, the smallest one (by area) will be prioritized as the "active" context.
**Alternatives**:

- `Spatial Database`: Ideally, the server would handle this, but for real-time smoothness and offline support, client-side check on the pre-fetched events is more responsive.

## Risks / Trade-offs

- **[Risk]** High battery consumption due to constant PiP checks. → **Mitigation**: Throttle checks to once per second (1Hz) and only when AR is visible.
- **[Risk]** Precise boundary accuracy. → **Mitigation**: Use the standard GeoJSON `boundary` field already present in the event model.
- **[Risk]** Complexity of overlapping events. → **Mitigation**: Sort by area; smaller polygons (usually more specific venues) take precedence over larger ones (e.g., a park boundary).
