## ADDED Requirements

### Requirement: GPU-Accelerated Clustering
The mobile map system SHALL aggregate individual POIs and saved locations into clusters when they are in close proximity, utilizing the MapLibre native engine.

#### Scenario: Zooming out aggregates markers
- **WHEN** the user zooms out beyond the `clusterMaxZoom` threshold
- **THEN** individual POIs within the same radius SHALL be replaced by a single cluster symbol showing the count.

#### Scenario: Clicking a cluster expands zoom
- **WHEN** a user clicks on a cluster symbol
- **THEN** the map camera SHALL zoom into the bounding box of the aggregated features.

### Requirement: Priority-Based Marker Exclusion
The clustering engine SHALL support a priority system where specific markers (e.g., "Main Stage") can be excluded from clustering or rendered with higher visibility.

#### Scenario: High priority marker remains visible
- **WHEN** a POI has a `priority` property set to `high`
- **THEN** it SHALL NOT be aggregated into a cluster and SHALL remain rendered as a distinct icon.
