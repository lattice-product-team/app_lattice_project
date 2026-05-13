## Why

The current admin interface feels cluttered with underutilized pages (Dash) and fragmented telemetry views (Radar). Consolidating these into a map-centric experience simplifies operations and provides immediate context upon entry.

## What Changes

- **Landing Page Refactor**: Move the global map from `/map` to the root `/`, making it the default experience.
- **Navigation Cleanup**:
    - Remove the "Dash" and "Radar" navigation items.
    - Remove the Lattice logo from the `FloatingNav` component.
    - Ensure only "MAP", "EVENTS", and "POIS" remain in the navbar.
- **Radar Integration**: Merge the live crowd telemetry (heatmap) functionality from the Radar page into the Map page as a toggleable layer.
- **Decommissioning**: Remove or archive the `(admin)/radar` and `(admin)/page.tsx` (current dash) routes.

## Capabilities

### New Capabilities
- `crowd-radar-layer`: Real-time heatmap visualization integrated directly into the global map with per-event toggles.

### Modified Capabilities
- `navigation-system`: Restructured navbar with reduced item count and removed brand logo.
- `event-operations-dashboard`: Removed the standalone dashboard in favor of map-first entry.
- `global-ops-center`: Enhanced with crowd intelligence layers and becoming the primary entry point.

## Impact

- **Frontend Routes**: `apps/admin-web/src/app/(admin)/page.tsx` will be replaced by the content of `apps/admin-web/src/app/(admin)/map/page.tsx`.
- **Navigation**: `apps/admin-web/src/components/floating-nav.tsx` will be simplified.
- **Map Component**: `apps/admin-web/src/components/map/admin-map.tsx` will gain heatmap layer support.
- **Radar Page**: `apps/admin-web/src/app/(admin)/radar/page.tsx` will be removed.
