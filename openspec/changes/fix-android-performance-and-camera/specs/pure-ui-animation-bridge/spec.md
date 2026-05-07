## ADDED Requirements

### Requirement: Android Blur Optimization

The `SafeBlurView` component SHALL provide a high-performance fallback (e.g. semi-transparent solid color with noise texture) on Android devices if hardware acceleration for Gaussian blur causes frame drops or significant UI lag.

#### Scenario: Opening Discovery Sheet on mid-range Android

- **WHEN** the bottom sheet is opened on a device with limited GPU performance
- **THEN** the blur intensity SHALL be reduced or replaced with an optimized translucent overlay to maintain 60fps.
- **THEN** the UI SHALL remain interactive and fluid during the animation.
