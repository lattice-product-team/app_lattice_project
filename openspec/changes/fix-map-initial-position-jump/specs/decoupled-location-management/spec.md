## ADDED Requirements

### Requirement: Synchronous Location Persistence

The system SHALL persist the user's last known coordinates synchronously to ensure they are available immediately upon application startup, preventing visual discontinuities during map initialization.

#### Scenario: Initial Map Render with Persisted Location

- **WHEN** the application starts with a previously saved location
- **THEN** the map component MUST initialize its camera at the persisted coordinates during the first render.

#### Scenario: Location Update on Startup

- **WHEN** the map has initialized with a persisted location and a more accurate current location is obtained
- **THEN** the system MUST update the store with the new coordinates and the map SHOULD smoothly transition to the new position if the difference is significant.
