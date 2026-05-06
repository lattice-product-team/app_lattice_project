# spatial-sync-engine Specification

## Purpose
This spec defines the synchronization engine for spatial data between Admin Web and Mobile.

## Requirements

### Requirement: Spatial Data Persistence
The system SHALL provide a mechanism to save and retrieve venue-level spatial configurations (Boundaries and Points of Interest) created via the Admin Web.

#### Scenario: Saving a Venue Map
- **WHEN** the user clicks "Save Venue Map" in the Map Editor after drawing a boundary and adding pins
- **THEN** the system MUST persist the GeoJSON boundary to the `venues` table and the individual markers to the `points_of_interest` table via the `geo` service.

### Requirement: Persistent Layer Rendering
The Map Editor SHALL automatically load and render any existing boundaries and POIs for a selected venue upon initialization.

#### Scenario: Loading Existing Map
- **WHEN** a user enters the Map Editor and selects a venue
- **THEN** the system SHALL fetch existing spatial data from the `geo` service and render them as static layers on the map.

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
