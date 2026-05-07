## ADDED Requirements

### Requirement: Android Gesture Transparency
The system MUST ensure that the Search Bar area of the Discovery Sheet does not consume touch events in its collocated (Level 1) state, allowing for uninterrupted pan gestures to initiate sheet expansion on Android devices.

#### Scenario: Dragging up from search bar at Level 1
- **WHEN** the sheet is in Level 1 (compact)
- **AND** the user initiates an upward "pan" gesture starting from the Search Bar area
- **THEN** the system MUST translate the gesture to sheet expansion (Level 2/3) without native component interference.

### Requirement: Conditional Input Interactivity
The Discovery Sheet Search Bar MUST be non-editable in Level 1 and become editable only after the sheet has transitioned past the Level 1 threshold.

#### Scenario: Tapping search bar at Level 1
- **WHEN** the sheet is in Level 1
- **AND** the user taps the Search Bar
- **THEN** the system MUST animate the sheet to Level 2/3 expansion rather than focusing the text input.
