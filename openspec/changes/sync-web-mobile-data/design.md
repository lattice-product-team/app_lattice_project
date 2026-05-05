## Context

The Admin Dashboard has been successfully styled with the ElevenLabs aesthetic but currently operates using hardcoded mock data for its core operational views (Events, Venues). Simultaneously, the mobile application manages its discovery layer using a mix of static assets and early-stage API calls that are not yet synchronized with the new Admin Map Editor.

## Goals / Non-Goals

**Goals:**
- Centralize data fetching logic in `admin-web` using a custom hook pattern.
- Eliminate all static mock arrays in the Admin Dashboard.
- Enable real-time reflection of Map Editor spatial changes in the Mobile discovery layer.
- Implement robust error handling for API failures to prevent frontend crashes.

**Non-Goals:**
- Implementing a full state management library (Redux/Zustand) if simple hooks suffice.
- Refactoring the backend database schema (using existing Drizzle schemas).
- Implementing offline support for the Admin Dashboard.

## Decisions

### 1. Centralized Data Hooks (`useAdminData`)
We will implement a custom hook pattern in a new `apps/admin-web/src/hooks/use-admin-data.ts` file.
- **Rationale**: Centralizing `fetch` logic with built-in `res.ok` checks and `Array.isArray` validation prevents the "not iterable" errors across multiple pages and ensures consistent loading/error UI states.
- **Alternatives**: Fetching directly in `useEffect` on every page (already shown to be error-prone and repetitive).

### 2. Spatial Data Consumption via GeoJSON
The mobile app will fetch spatial data directly from the `/spatial` endpoints of the `geo` service.
- **Rationale**: GeoJSON is the standard format for MapLibre (mobile) and the Web Map Editor. Sourcing from a single API endpoint ensures "what you see is what you get" across platforms.
- **Alternatives**: Bundling static GeoJSON files (leads to stale data and manual updates).

### 3. Defensive Rendering for Data Tables
All tables in the dashboard will use a guarded mapping pattern: `(data ?? []).map(...)`.
- **Rationale**: Protects the UI from breaking if the API returns a null or error object instead of a list.

## Risks / Trade-offs

- **[Risk] API Latency** → **Mitigation**: Implement skeleton loading states in `ElevenCard` and `Table` components to maintain a premium feel during data transit.
- **[Risk] Concurrent Edits** → **Mitigation**: For the MVP, we will rely on a "last-write-wins" approach, but we'll add a "Last Updated" timestamp to the spatial data to help users identify stale views.
- **[Risk] Large Spatial Payloads** → **Mitigation**: Ensure that the `/spatial` endpoint only returns geometries for the active viewport or selected venue.
