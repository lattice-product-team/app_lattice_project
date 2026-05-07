## ADDED Requirements

### Requirement: Coordinate Sanitization and Validation
The map system SHALL validate all incoming POI and Event coordinates. Any item with invalid coordinates (including `[0,0]`, `null`, or `undefined`) MUST NOT be rendered as a `MarkerView`.

#### Scenario: Bad data filtering
- **WHEN** the data adapter receives an event with coordinates `[0, 0]`
- **THEN** the item SHALL be filtered out of the interactive layer to prevent visual glitches in the viewport origin
