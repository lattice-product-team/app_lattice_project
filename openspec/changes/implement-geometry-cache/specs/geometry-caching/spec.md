## ADDED Requirements

### Requirement: Geometry Result Caching

The system SHALL cache GeoJSON responses for POIs and Event Spatial data in Redis to minimize PostGIS processing.

#### Scenario: Global POIs Cache Hit

- **WHEN** a client requests all POIs and the data exists in Redis
- **THEN** the system SHALL return the cached GeoJSON directly without querying PostGIS.

#### Scenario: Event Spatial Cache Population

- **WHEN** a client requests spatial data for an event AND it is NOT in Redis
- **THEN** the system SHALL fetch from PostGIS, store the result in Redis with an appropriate TTL, and return the data.

### Requirement: Reactive Cache Invalidation

The system SHALL automatically invalidate relevant geometry cache keys when spatial data is modified.

#### Scenario: POI Creation Invalidation

- **WHEN** a new POI is created via the API
- **THEN** the system SHALL delete the `geo:pois:all` cache key from Redis.

#### Scenario: Event Boundary Update Invalidation

- **WHEN** an event boundary is updated
- **THEN** the system SHALL delete the `geo:event:{id}:spatial` cache key from Redis.
