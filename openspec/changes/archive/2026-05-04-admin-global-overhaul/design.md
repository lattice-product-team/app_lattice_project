## Context

The `admin-web` is currently a prototype with hardcoded data and non-functional spatial tools. The mobile app has a robust MapLibre implementation, but there is no bridge for dynamic data defined by administrators.

## Goals / Non-Goals

**Goals:**

- Unify the map stack across Web and Mobile using MapLibreGL and shared MapTiler styles.
- Implement a stateful Map Editor with API persistence (Geo service + Drizzle).
- Create a global, data-driven dashboard in `admin-web`.
- Synchronize spatial boundaries and POIs between the admin panel and mobile clients.

**Non-Goals:**

- Real-time collaborative editing (multi-user simultaneous map editing).
- Advanced analytics (this is for operational monitoring, not deep business BI).
- Mobile-side map _creation_ (editing is web-only for now).

## Decisions

### 1. Map Stack: Unified MapLibreGL

- **Decision**: Replace `react-map-gl/maplibre` default setup in web with a custom wrapper that mirrors the mobile `MapContent` logic.
- **Rationale**: Ensures visual parity. Both will use `MAPTILER_KEY` and the same style URLs.

### 2. Persistence: Geo Service REST API

- **Decision**: The Map Editor will communicate with the `apps/server/geo` service via new endpoints: `POST /venues/:id/spatial` and `GET /venues/:id/spatial`.
- **Rationale**: Centralizes spatial logic. The `geo` service already manages navigation and location, making it the natural owner for venue maps.

### 3. Data Flow: Web -> DB -> Mobile

- **Decision**: Mobile will fetch spatial data as GeoJSON layers from the API on event/venue load.
- **Rationale**: Simplest sync mechanism that ensures mobile users always see the latest "official" map configuration.

### 4. UI Library: HeroUI v3 + Custom Hooks

- **Decision**: Use HeroUI for the dashboard and sidebar, but keep the Map Editor as a focused, high-performance canvas using custom React hooks for state management.
- **Rationale**: HeroUI handles standard layouts well, while the complex spatial state (undo/redo of points) needs specialized logic.

## Risks / Trade-offs

- **[Risk]** Large GeoJSON payloads affecting mobile performance → **[Mitigation]** Use simplified geometries for boundaries and lazy-load POIs.
- **[Risk]** Map style mismatches between browser and mobile rendering → **[Mitigation]** Use shared constant for style URLs in `@app/theme` or a shared package.
- **[Trade-off]** Web-only editing → Simplifies concurrency issues at the cost of less flexibility for field staff.

## Migration Plan

1. **Phase 1**: Update `packages/db` with necessary POI type expansions.
2. **Phase 2**: Implement `geo` service endpoints for spatial persistence.
3. **Phase 3**: Refactor `admin-web` Map Editor to use the new endpoints and MapLibre style.
4. **Phase 4**: Update `admin-web` root page to the Global Dashboard.
5. **Phase 5**: Update mobile `MapContent` to fetch and display the new dynamic layers.
