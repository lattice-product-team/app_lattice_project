## ADDED Requirements

### Requirement: Synchronized Control Positioning

The map controls (3D toggle, Recenter, Map Styles) SHALL be grouped and positioned dynamically relative to the top edge of the active bottom sheet.

#### Scenario: Controls following the sheet

- **WHEN** the user drags the bottom sheet up or down
- **THEN** the floating controls MUST move vertically in perfect synchronization, maintaining a fixed offset from the sheet's top border.

### Requirement: Apple-Style Control Grouping

Map actions MUST be organized into two distinct groups: a vertical "Vertical Control Pill" on the right for navigation and layers, and a circular "Binoculars" button on the left for exploration.

#### Scenario: Visual organization

- **WHEN** the map view is active
- **THEN** the right-side actions MUST be contained within a single vertical glass capsule with shared background and internal dividers.

### Requirement: Enhanced Action Feedback

All floating controls MUST provide haptic feedback and visual state changes (scale/opacity) when interacted with.

#### Scenario: Pressing 3D Button

- **WHEN** the user presses the 3D toggle
- **THEN** the system SHALL trigger a medium haptic impact and the button background MUST transition to the brand primary color if active.
