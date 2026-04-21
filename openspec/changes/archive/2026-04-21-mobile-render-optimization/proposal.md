## Why

The mobile application currently suffers from significant rendering performance issues and UI lag. This is primarily caused by frequent location updates triggering global re-renders of the root `MainScreen` and heavy components like `MapContent`, as well as inefficient state subscription patterns.

## What Changes

- **Global Location Store**: Introduce a Zustand store specifically for location to decouple GPS updates from the React render cycle.
- **Surgical State Subscriptions**: Refactor `MainScreen` and other components to use atomic selectors, preventing unnecessary re-renders when unrelated store parts change.
- **Map Decoupling**: Remove coordinate props from `MapContent` and move location-based logic to internal, highly-performant layers or store-driven updates.
- **Throttled Location Logic**: Implement a distance-based threshold for logic-heavy operations (like routing) while maintaining smooth visual updates.

## Capabilities

### New Capabilities
- `granular-mobile-state`: A standard for atomic state subscriptions in React Native to ensure 60fps UI responsiveness.
- `decoupled-location-management`: A location tracking system that updates logic-heavy state only on significant movement while allowing fluid visual tracking.

### Modified Capabilities
- `standards-alignment`: Extending performance standards to include React Native render optimization guidelines.

## Impact

- **Affected Code**: `apps/mobile/app/index.tsx`, `apps/mobile/src/hooks/useLocationService.ts`, `apps/mobile/src/store/useMapStore.ts`, `apps/mobile/src/components/map/MapContent.tsx`.
- **Dependencies**: React, React Native, Zustand, MapLibre.
