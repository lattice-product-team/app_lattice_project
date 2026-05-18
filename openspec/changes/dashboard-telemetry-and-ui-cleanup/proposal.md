## Why

The current `admin-web` dashboard relies heavily on mock data (e.g., hardcoded live users, capacity, and alerts) and has several UI components that are either non-functional or purely ornamental. This reduces the utility of the Operations Center for real-time monitoring and event management. To make the dashboard a reliable tool, we need to connect it to actual database telemetry and ensure that primary action buttons lead to relevant application areas.

## What Changes

- **Backend De-mocking**:
  - Update `getGlobalStats` to query real `telemetry_logs` for live user counts.
  - Aggregate real `capacity` from active event POIs.
  - Derive `activeAlerts` from POI status and crowd levels.
  - Implement real `getEventStats` based on event-specific telemetry and POI data.
- **Frontend Data Fixes**:
  - Fix the `useEventStats` hook to correctly handle global vs. event-specific data structures.
  - Resolve the "Synchronizing..." hang in the dashboard.
- **UI Refinement**:
  - Remove "Create New Event" and "System Logs" buttons from the dashboard header (per user request).
  - Link "View Map" to the Map Editor (`/map`) with the appropriate event context.
  - Link "Event Settings" to the Events management page (`/events`).

## Capabilities

### Modified Capabilities

- `event-operations-dashboard`: Transition from simulated telemetry to real-time database-driven metrics.
- `admin-web-ui`: Refine dashboard actions to improve operational flow and reduce UI noise.

## Impact

- **apps/server/api**: Logic updates in `geo.controller.ts` to replace mock data with SQL queries.
- **apps/admin-web**:
  - Data hook updates in `use-admin-data.ts`.
  - UI component cleanup and linking in `Dashboard.tsx`.
- **Database**: Increased (but optimized) query load on `telemetry_logs` and `points_of_interest`.
