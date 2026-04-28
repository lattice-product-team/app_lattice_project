## ADDED Requirements

### Requirement: Sticky Header Architecture
The system SHALL ensure that the header section of a bottom sheet (containing search bars or POI titles) remains persistently visible and interactive at the top of the sheet container, regardless of the scroll position of the supplemental content.

#### Scenario: Header stays fixed during scroll
- **WHEN** the user expands the POI detail sheet to its maximum height
- **AND** scrolls the supplemental content (description/reviews) upwards
- **THEN** the POI name and action buttons MUST remain fixed at the top of the visible sheet area.

### Requirement: Haptic Feedback on State Transition
The system SHALL trigger a light haptic impact when the bottom sheet transition completes or "snaps" into any of its predefined anchor points (Snap Points).

#### Scenario: Haptic pulse on snapping
- **WHEN** the user drags the sheet and releases it near a snap point
- **AND** the sheet settles into its new position (e.g., from Medium to Expanded)
- **THEN** the device SHALL emit a "Light" haptic feedback pulse.

### Requirement: Apple Maps-Style Snap Ratios
The system SHALL utilize snap points that prioritize ergonomic access and map visibility, mirroring the standard iOS Map experience.

#### Scenario: Snap point distribution
- **WHEN** the MapBottomSheet is initialized
- **THEN** it SHALL provide a "Collapsed" state (approx 10-12% height) showing only the search interface
- **AND** a "Medium" state (approx 45-50% height) for browsing content.
