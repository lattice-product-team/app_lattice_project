## Why

The current "Map Editor" in admin-web is overly complex and mixes concerns, leading to an unintuitive workflow where spatial data is managed in isolation. This change refactors the spatial management into a more natural, event-centric flow where boundaries are defined during event creation and assets are placed within those boundaries, ensuring perfect synchronization with the mobile application.

## What Changes

- **Map Editor Refactor**: Rename "Map Editor" to "Map" and transform it into a read-only global visualizer.
- **Global Visualization**: The new Map will show all event boundaries and all POIs across all events simultaneously, with interactive detail panels.
- **Event-Centric Creation**: Move boundary definition to the "Create Event" flow.
- **POI-Centric Creation**: Move asset placement to the "Points of Interest" flow, requiring an event selection to provide spatial context (showing the boundary).
- **Interactive Map Selection**: Implement map-based selection for both event boundaries and POI locations.
- **Mobile Synchronization**: Ensure all spatial changes are immediately reflected in the mobile app's map layers.

## Capabilities

### New Capabilities

- `admin-global-map`: A read-only, high-performance global map visualizer for all assets and events.
- `event-spatial-onboarding`: Integration of boundary drawing into the event creation wizard.
- `poi-spatial-onboarding`: Integration of coordinate picking into the POI registration flow, with event-boundary context.

### Modified Capabilities

- `event-poi-orchestration`: Updating the relationship and creation flow between events and their child assets.
- `spatial-sync-engine`: Ensuring that individual updates (instead of bulk spatial saves) are propagated correctly to the database and mobile clients.

## Impact

- **Frontend (admin-web)**: Major refactor of `app/map/page.tsx`, `app/events/page.tsx`, and `app/pois/page.tsx`. New shared map components.
- **Backend (geo-service)**: New REST endpoints for individual event and POI creation (`POST /events`, `POST /pois`).
- **Database**: Migration or logic update to handle individual asset creation vs bulk spatial updates.
- **Mobile (apps/mobile)**: No direct code changes expected, but verification of data consumption from the new unified endpoints.
