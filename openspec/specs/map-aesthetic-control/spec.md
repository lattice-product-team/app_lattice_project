# map-aesthetic-control Specification

## Purpose
TBD - created by archiving change clean-mobile-map-aesthetics. Update Purpose after archive.
## Requirements
### Requirement: Base map POI suppression
The mobile map system SHALL programmatically suppress the visibility of all default Points of Interest (POIs) provided by the base map style.

#### Scenario: POI cleanup
- **WHEN** the map style is prepared
- **THEN** all layers with `source-layer: "poi"` MUST have `visibility: "none"`

### Requirement: Maritime route suppression
The map system SHALL hide ferry lines and maritime labels to ensure a cleaner water aesthetic.

#### Scenario: Ferry removal
- **WHEN** the map style is prepared
- **THEN** layers `Ferry line` and `Ferry` MUST have `visibility: "none"`

### Requirement: Highway shield suppression
The map system SHALL hide highway shields (road number icons) while keeping the actual road names visible.

#### Scenario: Shield removal
- **WHEN** the map style is prepared
- **THEN** all layers with IDs containing `Highway shield` MUST have `visibility: "none"`

### Requirement: Geographic context preservation
The map system SHALL ensure that street names and city/locality labels remain visible.

#### Scenario: Label verification
- **WHEN** the map cleanup is applied
- **THEN** the layers `Road labels`, `City labels`, and `Town labels` MUST remain visible

