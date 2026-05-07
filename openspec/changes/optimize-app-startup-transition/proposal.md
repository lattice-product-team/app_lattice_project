## Why

The current app startup flow is sequential, which increases the total time the user spends waiting and reveals intermediate loading states (like the map spinner). By parallelizing data fetching with map initialization and orchestrating the splash screen visibility at the root level, we can provide an instantaneous, premium "ready-to-use" experience.

## What Changes

- **Root Level Orchestration**: Move the `AppSplashScreen` from the entry route to the global `_layout.tsx` to ensure it covers the entire application during initialization.
- **Parallel Loading Strategy**: Initiate the redirect to the main application routes immediately after fonts are loaded, allowing the map engine to start initializing while data is being pre-fetched in the background.
- **Unified Readiness Signal**: Synchronize the splash screen's hide animation with both data availability (TanStack Query) and map rendering readiness (MapLibre `onDidFinishLoadingStyle`).
- **Transition Polish**: Smooth out the splash screen's exit animation and eliminate the redundant `MapLoadingOverlay` spinner during the initial boot sequence.

## Capabilities

### New Capabilities

- `startup-orchestration`: Defines the requirements for synchronized, parallel app initialization and the "ready-state" handshake between the UI, data, and map layers.

### Modified Capabilities

- `hybrid-map-rendering`: Update rendering requirements to support a "hidden-start" mode where the map initializes behind an overlay to prevent visual pop-in.

## Impact

- `app/_layout.tsx`: Becomes the central coordinator for app readiness.
- `app/index.tsx`: Simplified to handle only the initial routing logic without UI responsibility.
- `src/features/map/components/MapContent.tsx`: Will emit readiness signals earlier and more reliably.
- `src/features/map/components/MapLoadingOverlay.tsx`: Modified to avoid showing the spinner during the coordinated startup phase.
