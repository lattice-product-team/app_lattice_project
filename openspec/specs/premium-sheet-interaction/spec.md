## MODIFIED Requirements

### Requirement: Sticky Header Architecture
The system SHALL ensure that the header section of a bottom sheet (containing search bars or POI titles) and the primary **Action Trident** (Navigate, Tickets, Calendar) remain persistently visible and interactive at the top of the sheet container, regardless of the scroll position of the supplemental content.

#### Scenario: Header and Actions stay fixed during scroll
- **WHEN** the user expands the POI detail sheet to its maximum height
- **AND** scrolls the supplemental content (description/reviews) upwards
- **THEN** the POI name, sub-category, and the three primary action buttons MUST remain fixed at the top of the visible sheet area.

## ADDED Requirements

### Requirement: The Action Trident Layout
The system SHALL implement a standardized three-button layout for all event and venue detail views to ensure consistent UX.

#### Scenario: Trident availability
- **WHEN** viewing a POI or Event detail sheet
- **THEN** the system MUST display three distinct actions:
  1. **Navigate**: Native routing to the location.
  2. **Tickets**: External or internal link to purchase/view entries.
  3. **Calendar**: Utility to add the event/date to the device's native calendar.

### Requirement: Omni-directional Drag-down Interaction
The Discovery Sheet MUST allow the user to initiate a "drag-down" gesture from any point within the sheet's content area when the internal scroll position is at the top (y <= 0).

#### Scenario: Dragging down from Level 3 Scroll
- **WHEN** the sheet is in Level 3 and the user scrolls to the top
- **THEN** continuing the downward gesture MUST translate the entire sheet downwards instead of bouncing the scroll.

### Requirement: Premium Motion Physics
The sheet transitions MUST utilize a spring physics model that conveys "mass" and "inertia", avoiding excessive bounciness or jitter during rapid gestures.

#### Scenario: Smooth Snap Point Transition
- **WHEN** a user releases the sheet after a flick gesture
- **THEN** the sheet MUST settle into the closest snap point with a damping ratio that minimizes oscillations (Premium Damping).
