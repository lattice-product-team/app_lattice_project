# Capability: Event-Centric Map Editor

## Purpose
Provide a spatial editing environment that treats Events as the primary root entity for geographic data.

## Requirements

### Requirement: Event-Centric Mapping Canvas
The system SHALL provide a map editor canvas that requires an active `eventId` to define the spatial boundary and map center for the event, completely replacing the venue-based canvas.

#### Scenario: Defining event bounds
- **WHEN** an administrator opens the Map Editor for a specific event
- **THEN** the editor MUST save the drawn polygon and center coordinates directly to the event record.

### Requirement: Event-Specific POI Placement
The map editor SHALL allow administrators to drop Points of Interest directly onto the event canvas, linking them exclusively to the current event.

#### Scenario: Dropping a POI
- **WHEN** a POI is created on the map
- **THEN** the POI MUST be assigned the active `eventId` and MUST NOT require a `venueId`.
