# Capability: Zoom-Based Discovery

## Purpose

Manage the visibility and presentation of assets based on the map's zoom level to optimize discovery and performance.

## Requirements

### Requirement: Zoom-Level Proximity Reveal

The system SHALL automatically reveal sub-POIs based on the current map zoom level to create an "approaching" discovery experience.

#### Scenario: Zooming into an Event

- **WHEN** the map zoom level increases above 14.5
- **THEN** the system SHALL calculate the proximity of the camera center to the nearest Event
- **AND** reveal the sub-POIs of that Event with a smooth fade-in animation

#### Scenario: Zooming out to Global View

- **WHEN** the map zoom level decreases below 13.5
- **THEN** the system SHALL fade out all sub-POIs and only show Event pins
