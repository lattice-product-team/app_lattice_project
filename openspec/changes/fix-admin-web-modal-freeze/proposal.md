## Why

The current implementation of event and asset creation in the `admin-web` causes a critical application freeze and fails to open the necessary creation interfaces. This prevents administrative users from performing core operational tasks. The issues stem from incorrect component usage, potential infinite re-renders during modal/map initialization, and inconsistent API patterns with the HeroUI library.

## What Changes

- **Fix Component Naming**: Rename `ModalContainer` to `ModalContent` to align with HeroUI v3 specifications, resolving the crash on modal open.
- **Refactor Select API**: Update `Select` component implementation in `POIsPage.tsx` and `RadarPage.tsx` to follow the standard HeroUI API, replacing the incorrect compound component pattern.
- **Dynamic Map Loading**: Implement dynamic imports with SSR disabled for `AdminMap` to ensure stable initialization within modal contexts and prevent layout-driven infinite loops.
- **Render Safeguards**: Add change detection to `Select` selection handlers and optimize modal render logic to prevent performance degradation and UI locks.

## Capabilities

### New Capabilities
- `admin-ui-stability`: Requirements for ensuring UI stability and preventing main-thread locks during complex component transitions (modals, maps).

### Modified Capabilities
- `event-poi-orchestration`: Update requirements for event and POI creation flows to ensure reliable modal-based interactions.
- `eleven-ui-components`: Refine standards for using HeroUI components to ensure alignment with v3 patterns.

## Impact

- **Affected Code**: `apps/admin-web/src/app/events/page.tsx`, `apps/admin-web/src/app/pois/page.tsx`, `apps/admin-web/src/app/radar/page.tsx`, `apps/admin-web/src/components/map/admin-map.tsx`.
- **Dependencies**: `@heroui/react`, `react-map-gl`.
- **System**: Administrative dashboard stability and core data entry workflows.
