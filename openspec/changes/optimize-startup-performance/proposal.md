## Why

The application takes 6.5 seconds to start (Splash Screen to interactive Map), which is significantly above the performance standard for a premium experience. This delay is primarily caused by obsolete remote style pre-warming and late data fetching after the map component has already mounted.

## What Changes

- **Asset Pre-loading**: Migrate from remote style "pre-warming" to local asset pre-loading using Expo's `Asset.loadAsync`.
- **API Pre-fetching**: Implement early data fetching for POIs and Events in the `RootLayout` or `Index` level to populate the cache before the Map mounts.
- **Dead Code Removal**: Remove `useMapStyle.ts` and related remote fetching logic that is no longer used due to local style bundling.
- **Boot Sequence Optimization**: Adjust the `RootLayout` to prioritize critical path assets (fonts, auth state) and defer non-critical initialization.

## Capabilities

### New Capabilities

- `startup-performance-monitor`: Add basic logging to track TTI (Time to Interactive) in production/development.

### Modified Capabilities

- `map-discovery`: Requirement changed to support "Instant Data" (loading markers from cache immediately on mount).

## Impact

- **RootLayout**: Changes in the initialization sequence.
- **Index Component**: Addition of pre-fetching logic.
- **Assets**: Improved management of local style JSONs.
- **Network**: Significant reduction in initial network requests.
