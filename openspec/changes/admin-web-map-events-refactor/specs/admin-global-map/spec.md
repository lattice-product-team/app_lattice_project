## ADDED Requirements

### Requirement: Global Asset Visualization
The admin system SHALL provide a unified map interface that displays all active event boundaries and all associated points of interest simultaneously.

#### Scenario: Visualizing the entire operational landscape
- **WHEN** the user navigates to the "Map" section
- **THEN** the system SHALL fetch and render every active event boundary and its child assets on a single MapLibre instance.

### Requirement: Interactive Layer Filtering
The global map SHALL provide a layer control interface allowing users to toggle the visibility of individual events.

#### Scenario: Hiding specific events
- **WHEN** the user unchecks an event in the layer control panel
- **THEN** its boundary and all associated POIs MUST be removed from the map view.

### Requirement: Asset Detail Discovery
Clicking on any asset or boundary on the global map SHALL trigger a detail view showing its operational status and metadata.

#### Scenario: Inspecting a POI
- **WHEN** the user clicks on a POI pin on the map
- **THEN** the system SHALL display a panel with the POI name, type, and live occupancy data.
