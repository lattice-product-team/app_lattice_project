## Why

The current `admin-web` is highly fragmented, using hardcoded mock data for the dashboard and an isolated, non-functional Map Editor. To scale the platform into a true Event Management SaaS, we need to transition from "event-centric hardcoding" (specific to Barcelona) to a **Global Dashboard** with real-time stats and a functional **Spatial Configuration Engine** that syncs seamlessly with the mobile application.

## What Changes

- **Global Dashboard**: Replace the hardcoded Barcelona-specific dashboard with a dynamic overview of all venues and events, including global metrics (live users, active events, alerts).
- **Map Unification**: Align the `admin-web` map engine and visual style with the mobile app (transitioning to MapLibre with the Apple-inspired style).
- **Spatial persistence**: Implement saving/loading for the Map Editor. Boundaries and Pins (POIs) created on the web must be stored in the database.
- **Enhanced POI Customization**: Extend Pin configuration to include labels, descriptions, and semantic types (WC, Restaurant, Medical, etc.).
- **Mobile Sync Engine**: Ensure that spatial data (boundaries/POIs) saved in the admin-web are immediately available and rendered in the mobile app's map view.
- **Navigation UX**: Add a root-level shortcut (Home) to the sidebar to allow users to return to `localhost:3004` from any sub-page.

## Capabilities

### New Capabilities

- `global-ops-center`: The main dashboard for multi-event monitoring and global statistics.
- `spatial-sync-engine`: The mechanism that bridges web-created maps with mobile clients.

### Modified Capabilities

- `admin-ui-modernization`: (From previous work) Expanding to include the new global layout and map styles.
- `map-discovery-v2`: Update requirements to ensure mobile clients pull dynamic boundary/POI data from the shared `geo` service instead of static files.

## Impact

- **`apps/admin-web`**: Overhaul of the main page, Map Editor logic, and sidebar.
- **`apps/mobile`**: Update `MapContent` to dynamically fetch and render venue-specific boundaries and POIs.
- **`apps/server/geo`**: New API endpoints for saving/retrieving venue maps and event spatial data.
- **`packages/db`**: Ensure schema consistency for advanced POI metadata.
