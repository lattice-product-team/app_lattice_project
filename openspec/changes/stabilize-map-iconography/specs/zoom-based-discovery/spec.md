# zoom-based-discovery Delta Specification

## MODIFIED Requirements

### Requirement: Zoom-Level Proximity Reveal

The system SHALL automatically reveal sub-POIs based on the current map zoom level to create an "approaching" discovery experience.

#### Scenario: Zooming into an Event

- **WHEN** the map zoom level increases above 13.5
- **THEN** the system SHALL reveal the sub-POIs of the relevant area with a smooth fade-in animation
- **AND** ensure that all revealed POIs use the "Layout Shield" from the `map-marker-system`.

#### Scenario: Zooming out to Global View

- **WHEN** the map zoom level decreases below 13.0
- **THEN** the system SHALL fade out all sub-POIs and only show main Event pins to optimize performance.
