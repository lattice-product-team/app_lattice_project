## ADDED Requirements

### Requirement: Event Data Bundling

The system must be able to bundle all necessary geo-data and assets for a specific event for offline usage.

#### Scenario: Manual Download Trigger

- **WHEN** a user clicks "Descargar para modo offline" in the event detail view
- **THEN** the application must download map tiles within the event boundary and cache all associated POIs and path segments locally.

### Requirement: Offline Navigation Support

The navigation engine must fall back to local data when no internet connection is detected.

#### Scenario: Routing without Connectivity

- **WHEN** the device is offline and an active event package is present
- **THEN** the routing logic must use the locally cached path segments to calculate directions.
