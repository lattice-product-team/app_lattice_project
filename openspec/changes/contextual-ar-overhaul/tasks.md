## 1. Geo Utilities

- [x] 1.1 Implement `isPointInPolygon` ray-casting algorithm in `apps/mobile/src/utils/geoUtils.ts`
- [x] 1.2 Add `calculatePolygonArea` utility to handle overlapping boundary prioritization

## 2. Store & Hook Enhancement

- [x] 2.1 Update `useARStore` to include `currentEventContext` and `isWithinBoundary` states
- [x] 2.2 Refactor `useARData` to perform real-time PiP checks against `allEvents`
- [x] 2.3 Implement mode switching logic in `useARData`: return events as "Beacons" if outside boundaries, or POIs if inside

## 3. UI Immersion

- [x] 3.1 Update `apps/mobile/app/(main)/index.tsx` to hide `FloatingSearchBar` when AR is active
- [x] 3.2 Update `apps/mobile/app/(main)/index.tsx` to hide `modeToggleContainer` when AR is active
- [x] 3.3 Ensure smooth opacity transitions for hidden elements using Reanimated

## 4. Component Refinement

- [x] 4.1 Update `ARHUD` to display contextual status messages based on the current mode
- [x] 4.2 Update `ActionPillBar` (or `useDetailModel`) to disable "Use AR" if user is not in the event boundary
- [x] 4.3 Adjust `AROverlay` 2D labels and 3D pins to distinguish between Event Beacons and POI Pins

## 5. Verification

- [x] 5.1 Verify that entering/exiting a boundary correctly triggers the AR mode switch
- [x] 5.2 Verify that UI elements (search, nav) are hidden only when AR is visible
- [x] 5.3 Test the "Use AR" button state in the event detail sheet based on location
