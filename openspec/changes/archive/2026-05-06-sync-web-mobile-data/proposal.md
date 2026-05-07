## Why

Currently, the Admin Dashboard relies on hardcoded static data for its primary operational views (Events and Venues), which makes it impossible to manage real-world data effectively. Furthermore, while the Map Editor allows for spatial data creation, this information is not yet dynamically consumed by the mobile application, leading to a fragmented user experience between management and discovery.

## What Changes

- **Dynamic Data Sourcing**: Transition `EventsPage` and `VenuesPage` from static mock arrays to dynamic `fetch` calls against the backend API.
- **Robust API Layer**: Implement standardized error handling and loading states for all administrative data tables to prevent frontend crashes (e.g., handling non-iterable error responses).
- **Spatial Data Pipeline**: Synchronize the Map Editor's output (POIs and boundaries) with the mobile app's `geoService` to ensure discovery reflects real-time edits.
- **Schema Unification**: Align the internal data models for venues and events across the frontend (Web/Mobile) and backend services.

## Capabilities

### New Capabilities

- `admin-api-integration`: A standardized pattern for fetching, validating, and displaying administrative data in the web dashboard.
- `cross-platform-spatial-sync`: The infrastructure and logic required to propagate spatial edits from the admin environment to the mobile discovery layer.

### Modified Capabilities

- `event-operations-dashboard`: Updating operational requirements to move from static monitoring to dynamic, real-time data management.
- `map-discovery-platform`: Modifying the discovery logic to prioritize dynamic spatial data from the server over local or hardcoded fallbacks.

## Impact

- **Frontend (Web)**: Significant refactor of `EventsPage` and `VenuesPage`.
- **Frontend (Mobile)**: Update `geoService` and `useAppFonts` (if typography needs adjustment) to ensure seamless data consumption.
- **Backend**: Potential exposure of new API endpoints or refinement of existing ones to support administrative filtering and spatial queries.
