## Context

The `admin-web` application currently has a fragmented navigation structure. The "Dash" page is a placeholder, and "Radar" is a standalone page for telemetry. The "Map" page is at `/map`. Users need to switch between Map and Radar to see assets vs. density.

## Goals / Non-Goals

**Goals:**
- Unify Map and Radar into a single "Global Operations" view.
- Make the Map the entry point of the application.
- Simplify navigation by removing branding and underused items.

**Non-Goals:**
- Real-time navigation for admin users (moving markers).
- History playback for telemetry (keep it live-only for now).

## Decisions

### 1. Route Consolidation
- **Decision**: Replace `(admin)/page.tsx` with the logic from `(admin)/map/page.tsx` and delete the `/map` and `/radar` routes.
- **Rationale**: Simplifying the URL structure reflects the new map-centric architecture.
- **Alternative**: Redirecting `/` to `/map`. Rejected because it keeps the URL longer than necessary for the primary view.

### 2. Radar Integration in AdminMap
- **Decision**: Add `Source` and `Layer` for heatmaps to `AdminMap` component. Control visibility via a new `showRadar` prop or by checking if `radarData` is present.
- **Rationale**: Keeps the map component as the single source of truth for all spatial visualizations.

### 3. Per-Event Radar Toggles
- **Decision**: Add a "Radar" icon/button next to each event in the "Active Layers" panel.
- **Rationale**: Allows operators to focus on telemetry for specific events without cluttering the map with all heatmaps at once.

### 4. Telemetry Fetching
- **Decision**: Implement a `useTelemetry` hook or polling logic in the main page that fetches data for all events with active radar toggles.
- **Rationale**: Centralizes data fetching and ensures real-time updates (5s interval).

## Risks / Trade-offs

- **[Risk]**: Performance degradation with many heatmap layers. → **Mitigation**: Only fetch and render heatmaps for explicitly toggled events.
- **[Risk]**: Conflict with existing `(admin)/map` logic if users have it bookmarked. → **Mitigation**: Add a temporary redirect from `/map` to `/` in `next.config.js` or a client-side effect.
