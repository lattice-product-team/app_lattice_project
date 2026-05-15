## Context

The `MapLibreGL.UserLocation` component on Android currently uses `androidRenderMode="gps"`. This mode relies on the GPS bearing for orientation, which only updates when there is significant movement. For a pedestrian or a user standing still and rotating their device, this results in a non-responsive UI.

## Goals / Non-Goals

**Goals:**
- Fix the lack of reactivity in the user location pointer on Android.
- Enable smooth heading updates when rotating the device.
- Ensure the pointer updates position smoothly during movement.

**Non-Goals:**
- Changes to the iOS location implementation.
- Redesigning the `useLocationService` hook.

## Decisions

### Decision: Use `compass` render mode on Android
- **Rationale**: The `compass` mode in MapLibre Android utilizes the device's magnetometer/gyroscope sensors to update the heading indicator in real-time, even when the user is stationary. This matches the behavior on iOS.
- **Alternatives**:
  - `normal`: Only shows a dot, no heading.
  - `gps`: Current (broken) state, only reactive to movement vectors.

## Risks / Trade-offs

- **[Risk] Battery consumption** → Using the compass sensor might consume slightly more battery than GPS-only, but it is necessary for the expected UX. Mitigation: The system already manages accuracy via `useLocationService` when in different modes (navigating vs. idle).
- **[Risk] Magnetometer interference** → In some environments, the compass might be inaccurate. Mitigation: This is a standard limitation of mobile devices; the user is usually prompted by the OS to calibrate if needed.
