## Why

The current map and location system suffers from state fragmentation across multiple stores (`useMapUIStore`, `useNavigationStore`, `usePOIStore`) and components. This leads to animation "fighting," UI flickering, and recurring camera lockups on Android. A unified, state-machine-driven approach is required to provide a professional, fluid, and scalable experience for both Android and iOS.

## What Changes

- **Master Mode Orchestration**: Implement a single source of truth for the application's active mode (Exploring, Detail, Planning, Navigating, AR).
- **Refactor MapCameraManager**: Move from reactive, fragmented `useEffect` hooks to a centralized, imperative transition manager that handles entering/exiting modes.
- **Android Resilience Protocol**: Introduce a mandatory "camera goal reset" before each programmatic move to eliminate native engine lockups.
- **Unified UI Layers**: Synchronize the visibility of MapLayers, HUD controls, and sheet positions based on the master mode.
- **Camera/AR Optimization**: Refine the integration between MapLibre and Expo-Camera to ensure smooth transitions and consistent performance across platforms.

## Capabilities

### New Capabilities
- `unified-map-orchestration`: A centralized manager for application modes, camera transitions, and UI layer synchronization.

### Modified Capabilities
- `navigation-system`: Update requirements to formalize the transition between "Planning" and "Navigating" camera behaviors.
- `hybrid-map-rendering`: Refine camera behavior requirements to include platform-specific resilience protocols for Android.
- `granular-mobile-state`: Align global state updates with the new unified mode orchestration to reduce redundant re-renders.

## Impact

- **Affected Code**: `apps/mobile/src/features/map/store/useMapUIStore.ts`, `apps/mobile/src/features/map/components/MapCameraManager.tsx`, `apps/mobile/src/features/map/components/MapContent.tsx`, `apps/mobile/src/features/navigation/store/useNavigationStore.ts`, `apps/mobile/app/(main)/index.tsx`.
- **Dependencies**: No new external dependencies; optimizing usage of `@maplibre/maplibre-react-native` and `expo-camera`.
- **Performance**: Improved battery life and reduced lag on Android due to fewer redundant re-renders and camera fights.
