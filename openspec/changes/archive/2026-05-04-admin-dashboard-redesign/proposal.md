## Why

The current dashboard in the Admin Web application is using generic placeholders (Total Sales, Employee table) that do not align with the core purpose of Lattice: managing high-density events like Formula 1. This redesign will transform the landing page into a live operations center that provides immediate value to event administrators by displaying real-time spectator density, gate congestion, and active incident alerts.

## What Changes

- **Dashboard Header**: Replace "Good morning, Kate" greeting with a context-aware header showing current live event status.
- **Overview Metrics**: Replace sales metrics with real-time operational KPIs: Active Spectators, Incident Alerts, and Ticket Claim Percentage.
- **Charts Section**: 
  - Replace "Total Sales" bar chart with a "Spectator Inflow/Density" visualization.
  - Replace the generic line chart with "Entry Flow by Gate" or "Zone Congestion" trends.
- **Operations Table**: Replace the "Employees Table" with a "Gate & POI Live Status" table showing congestion levels, wait times, and operational status.
- **Navigation/UI**: Unify all action buttons (Create, Invite, etc.) to the HeroUI v3 "rounded-full" aesthetic established in recent updates.

## Capabilities

### New Capabilities
- `event-operations-dashboard`: Defines the requirements for real-time visualization of event-specific telemetry, gate congestion levels, and spectator inflow metrics.

### Modified Capabilities
- `standards-alignment`: Ensuring the dashboard adheres to the newly established HeroUI v3 / Tailwind v4 design tokens and component patterns.

## Impact

- **Affected Code**: `apps/admin-web/src/app/page.tsx`, `apps/admin-web/src/components/`
- **Dependencies**: Relies on data structures defined in `packages/db/schema.ts` (Point of Interest, Telemetry Logs, Tickets).
- **APIs**: Future integration with real-time WebSocket/Socket.io telemetry streams.
