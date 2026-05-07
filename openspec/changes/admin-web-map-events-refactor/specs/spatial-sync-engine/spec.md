## MODIFIED Requirements

### Requirement: Spatial Data Persistence

The system SHALL provide a mechanism to save and retrieve event-level spatial configurations (Boundaries and Points of Interest) created via the Admin Web.

#### Scenario: Saving an Event Map

- **WHEN** the user creates an event or asset
- **THEN** the system MUST persist the spatial data (Boundary or Point) to the respective table (`events` or `points_of_interest`) via individual RESTful POST requests.

### Requirement: Persistent Layer Rendering

The Admin Map SHALL automatically load and render all existing boundaries and POIs upon initialization.

#### Scenario: Loading Global Map

- **WHEN** a user enters the Map section
- **THEN** the system MUST fetch all events and POIs and populate the global visualizer.

### Requirement: Rich POI Configuration

The system SHALL allow users to specify semantic metadata for each Point of Interest, including Name and Type (e.g., WC, Restaurant, Entrance).

#### Scenario: Customizing a Pin

- **WHEN** a user adds a new POI marker
- **THEN** they MUST be able to provide a label and select a category from the `poiTypeEnum` options.

### Requirement: Web-Mobile Map Unification

The Admin Web map MUST use the same visual style and map engine (MapLibreGL) as the mobile application to ensure "What You See Is What They Get" (WYSIWTG) consistency.

#### Scenario: Map Style Alignment

- **WHEN** the Map Editor is loaded
- **THEN** it SHALL use the MapTiler `streets-v2-dark` style (or the localized Apple-style equivalent) shared with the mobile app.

### Requirement: Dynamic Mobile Synchronization

The mobile application SHALL dynamically fetch and render the venue boundary and POIs defined in the Admin Web.

#### Scenario: Mobile Reflection of Web Changes

- **WHEN** a mobile user views a venue map
- **THEN** the app SHALL render the exact boundary and POIs that were persisted from the Admin Web.
