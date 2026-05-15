## ADDED Requirements

### Requirement: Android Compass Reactivity

The user location indicator on Android SHALL utilize the device's compass/magnetometer to provide real-time heading updates, even when stationary.

#### Scenario: Stationary Rotation on Android

- **WHEN** the user is standing still and rotates the device
- **THEN** the heading arrow of the user location indicator on the map MUST rotate in sync with the device's physical orientation.

### Requirement: Android Movement Smoothness

The user location indicator on Android SHALL update its position smoothly during physical movement by utilizing native GPS and sensor fusion.

#### Scenario: Low-Speed Movement on Android

- **WHEN** the user is walking slowly
- **THEN** the user location indicator MUST update its position on the map without jumping or lagging.
