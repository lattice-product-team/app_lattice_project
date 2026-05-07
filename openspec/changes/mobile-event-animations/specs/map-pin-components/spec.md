## MODIFIED Requirements

### Requirement: Event Pin Visuals (Apple Style)

The system SHALL display Event pins as high-fidelity circular markers containing an image of the event. The pin MUST include a white border and a drop shadow. Selecting the pin MUST trigger a map camera fly-to animation without introducing new bouncy pin animations.

#### Scenario: Normal Display

- **WHEN** the map renders an event pin in its default state
- **THEN** it shows a 44x44px circular image with a 2px white border and a label below

#### Scenario: Selected State

- **WHEN** an event pin is selected
- **THEN** the pin SHALL grow in size (e.g., 60x60px), display a "pin tail" pointing to its exact coordinate, and trigger a camera fly-to animation.
