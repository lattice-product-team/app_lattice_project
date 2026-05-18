## Context

The mobile map implementation on Android currently suffers from camera instability during state transitions (e.g., deselecting a POI). The custom camera tracking enum system is also non-standard and uses deprecated/obsolete library patterns, leading to fragile cross-platform behavior.

## Goals / Non-Goals

**Goals:**

- Eliminate the "bounce" effect on Android when deselecting map items.
- Modernize the camera tracking state management by adopting native library enums.
- Simplify `MapCameraManager` by removing redundant prop mappings.
- Ensure consistent 4-state tracking cycle (Free -> Follow -> Compass -> Course) across both platforms.

**Non-Goals:**

- Redesigning the Map UI components themselves.
- Changing the underlying map library (MapLibre).

## Decisions

### 1. Adopt `UserTrackingMode` Integer Enum

Instead of the custom string-based `MapCameraMode`, we will use the native `MapLibreGL.UserTrackingMode` integers in `useMapUIStore.ts`.

- **Rationale**: Integer enums are more robust for native bridge communication and align with the library's internal state.
- **Mapping**:
  - `0`: None (Free)
  - `1`: Follow
  - `2`: FollowWithHeading (Compass)
  - `3`: FollowWithCourse (Course)

### 2. State-Preserving `safetyReset` for Android

Modify the `safetyReset` callback in `MapCameraManager.tsx` to explicitly include the current map center when running on Android.

- **Rationale**: Android's `setCamera` implementation often re-centers on the last programmatic target if a new center is not provided. By passing the current center, we "lock" the position while resetting padding.

### 3. Direct Prop Mapping in `MapLibreGL.Camera`

Update `MapCameraManager` to pass the `userTrackingMode` prop directly instead of separate `followUserLocation` and `followUserMode` props.

- **Rationale**: The `userTrackingMode` prop is the modern way to control tracking in `maplibre-react-native` and reduces the logic footprint in our manager.

## Risks / Trade-offs

- **[Risk]** `lastCameraPosition` staleness: If the store hasn't updated the last position before `safetyReset` fires, a minor jump might occur.
  - **Mitigation**: Ensure `MapContent` updates the store position on every region change and use the store's latest value.
- **[Risk]** Breaking legacy mode cycle: The `triggerRecenter` logic needs to be carefully updated to cycle through 0-3 correctly.
  - **Mitigation**: Implement a clean modulo or switch-based incrementer for the `UserTrackingMode`.
