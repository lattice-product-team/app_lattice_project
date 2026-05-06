## ADDED Requirements

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
