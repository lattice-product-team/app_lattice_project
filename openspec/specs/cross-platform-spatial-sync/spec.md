# Capability: Cross-Platform Spatial Sync

## Purpose

Ensure consistent spatial data representation and real-time synchronization between web and mobile platforms.

## Requirements

### Requirement: Real-time Spatial Persistence

The system SHALL persist all Map Editor modifications (perimeters, markers, and POIs) to the centralized database immediately upon user confirmation.

#### Scenario: Saving a Venue Perimeter

- **WHEN** a user saves a new boundary in the Map Editor
- **THEN** the system MUST update the `venues.boundary` column and ensure the change is reflected in subsequent spatial API queries.

### Requirement: Dynamic Mobile Discovery Sourcing

The mobile application SHALL source its spatial discovery layers (Events and POIs) from the live API rather than bundled asset files or local cache.

#### Scenario: Reflecting Editor Changes on Mobile

- **WHEN** a new POI is added via the Web Map Editor
- **THEN** the next time the mobile app refreshes its map view (or on subsequent session), the new POI MUST appear on the mobile discovery interface.

### Requirement: Unified Coordinate System

All spatial data exchanged between the editor and the mobile client MUST adhere to the GeoJSON standard using the EPSG:4326 coordinate reference system.

#### Scenario: Consistent Marker Positioning

- **WHEN** a marker is placed at specific coordinates in the Web Map Editor
- **THEN** it MUST render at exactly the same geographic location in the mobile MapLibre view.
