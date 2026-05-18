## Why

The current user location indicator on Android is not reactive. The pointer remains static even when the user moves, and the heading arrow does not update in real-time when the device is rotated. This creates a poor user experience compared to iOS, where location and heading updates are fluid.

## What Changes

- Update `MapLibreGL.UserLocation` configuration on Android to use `compass` render mode.
- Ensure location updates are reactive to both movement and device orientation changes on Android.

## Capabilities

### New Capabilities

- None

### Modified Capabilities

- `decoupled-location-management`: Ensure the "Smooth Map Tracking" requirement is correctly implemented for Android by utilizing appropriate native render modes.

## Impact

- `apps/mobile/src/features/map/components/MapContent.tsx`: Modification of the `UserLocation` component props.
- Android devices running the mobile application.
