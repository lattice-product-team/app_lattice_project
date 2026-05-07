## Why

Currently, the mobile app map initializes at a hardcoded Madrid coordinate before the location service can provide the user's position, resulting in a visible "jump" from Madrid to the user's location. This feels unpolished and jarring to the user.

## What Changes

- Add persistence to `useLocationStore` using MMKV to save the last known location.
- Modify `MapCameraManager` to use the persisted location (if available) as the initial center of the map.
- Ensure the map initializes at the user's last known location instead of a hardcoded default.
- Refactor the blur implementation in `EventDetailSheet` and `POIMiniCard` to use a layered architecture for better visual fidelity.

## Capabilities

### Modified Capabilities

- `decoupled-location-management`: Add requirement for location persistence to ensure a seamless startup experience.

## Impact

- `useLocationStore`: Will now use Zustand persistence with MMKV.
- `MapCameraManager`: Will have its `defaultSettings` populated with the persisted location.
- User experience: Seamless map initialization at the correct (or last known) location.
