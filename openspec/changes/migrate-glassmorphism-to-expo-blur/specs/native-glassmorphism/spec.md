## ADDED Requirements

### Requirement: Native Glassmorphism Fallback Chain
The system SHALL implement a multi-tier fallback mechanism for glassmorphism to ensure visual continuity regardless of native module availability.

#### Scenario: Skia Unavailable
- **WHEN** the `@shopify/react-native-skia` native module fails to load or is not detected
- **THEN** the system SHALL immediately fallback to `expo-blur` to provide a native hardware-accelerated blur effect

#### Scenario: Total Native Failure
- **WHEN** both Skia and `expo-blur` are unavailable (e.g., specific legacy environments)
- **THEN** the system SHALL render a high-quality translucent background using standard React Native `View` components

### Requirement: Unified Glass Intensity Mapping
The system SHALL map visual "intensity" values consistently across different blur engines to maintain the same aesthetic regardless of the underlying technology.

#### Scenario: Theme Switch
- **WHEN** the application theme changes from light to dark
- **THEN** the `SafeBlurView` SHALL adjust its `tint` and `intensity` props automatically to maintain readability of overlay content

### Requirement: Cross-Platform Blur Parity
The system SHALL ensure that both iOS and Android users receive a blurred background experience for floating UI elements.

#### Scenario: Android Loading
- **WHEN** a floating search bar is rendered on Android
- **THEN** the system SHALL use either Skia or the native Android `RenderEffect` (via `expo-blur`) to ensure the background is blurred
