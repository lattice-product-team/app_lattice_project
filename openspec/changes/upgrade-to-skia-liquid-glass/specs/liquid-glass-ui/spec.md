## ADDED Requirements

### Requirement: GPU-Accelerated Backdrop Blur
The system SHALL use a GPU-accelerated backdrop blur mechanism (provided by Skia) to render frosted glass effects on UI surfaces.

#### Scenario: High-Fidelity Blur Rendering
- **WHEN** a `SafeBlurView` is rendered over the map
- **THEN** it MUST use Skia's `BackdropBlur` to process the underlying content with high visual fidelity.

### Requirement: Organic Liquid Distortion
The system SHALL support an optional organic "liquid" distortion effect on blurred surfaces using custom Skia shaders to create a dynamic and premium aesthetic.

#### Scenario: Liquid Effect on Scroll
- **WHEN** the user drags a blurred sheet (e.g., `EventDetailSheet`)
- **THEN** the shader MUST adjust its distortion parameters to create a fluid, organic visual response.

### Requirement: Cross-Platform Visual Consistency
The blur effect SHALL maintain visual parity and consistent performance across both iOS and Android devices, including those using the New Architecture (Fabric).

#### Scenario: Android Blur Quality
- **WHEN** rendered on an Android device
- **THEN** the blur quality MUST be indistinguishable from the iOS implementation, without the artifacts typically associated with native Android blur fallbacks.
