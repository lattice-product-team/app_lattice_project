## Why

Currently, the mobile app and Admin Web require manual refreshes or re-mounts to reflect spatial changes (new POIs, updated event boundaries). In a premium high-traffic environment, map data must be authoritative and instant. This change introduces real-time cache invalidation signals via Socket.io to ensure that any modification in the Admin Web is immediately reflected in all active mobile devices without user intervention.

## What Changes

- **Backend (API)**:
    - Centralize synchronization signals in a dedicated service or utility.
    - Enhance `geo.controller.ts` to emit `sync:pois` and `sync:events` signals on every Create, Update, and Delete operation.
    - Ensure these signals are broadcasted to all connected clients.
- **Mobile App**:
    - Implement a `RealtimeSyncProvider` that listens for synchronization signals.
    - Integrate with **TanStack Query** to perform targeted cache invalidation when a signal is received.
    - Ensure smooth map updates without UI flickering.
- **Admin Web**:
    - Ensure that actions performed in the Admin Web trigger the same signals, allowing multiple admins to stay in sync.

## Capabilities

### New Capabilities
- `real-time-sync-signals`: Defines the protocol and events for real-time synchronization signals between the server and all client types (Mobile/Admin).

### Modified Capabilities
- `spatial-sync-engine`: Update requirements to include mandatory real-time reflection of persisted spatial data.

## Impact

- **API**: `apps/server/api/src/geo/controllers/geo.controller.ts` and `@app/core` notification logic.
- **Mobile**: `apps/mobile/src/hooks/useSocket.ts` integration and a new global provider.
- **Data Flow**: Shift from polling/manual-refresh to event-driven invalidation.
