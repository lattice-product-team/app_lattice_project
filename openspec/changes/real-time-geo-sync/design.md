## Context

Currently, `geo.controller.ts` manages spatial data for events and POIs. While it updates the database and invalidates local Redis caches, it does not consistently notify connected clients. On the client side (Mobile), the `useSocket` hook exists but is not utilized for data synchronization, forcing users to manually reload the app to see updates.

## Goals / Non-Goals

**Goals:**
- Implement a server-side notification pattern for all Geo CRUD operations.
- Create a central `SyncProvider` in the mobile app to handle real-time signals.
- Use **TanStack Query** cache invalidation to trigger data refreshes.
- Ensure the Admin Web's actions are immediately visible on mobile devices.

**Non-Goals:**
- Implementing "Delta" updates (sending only changed fields). We will invalidate the entire relevant query to ensure data integrity.
- Real-time tracking of moving assets (out of scope for this change).

## Decisions

### 1. Signal-Based Synchronization (Invalidation)
Instead of pushing full JSON objects through WebSockets, the server will emit lightweight "signals" (e.g., `{ type: 'POI', action: 'CREATED' }`).
- **Rationale**: This ensures that the mobile app always fetches the "source of truth" from the REST API, avoiding state desynchronization issues. It also minimizes WebSocket bandwidth usage.

### 2. Centralized Notification Utility in `@app/core`
We will refine the existing `notifyAll` and `notifyAdmin` utilities to be more robust.
- **Rationale**: Keeps the controller logic clean and allows for future migration to Redis Pub/Sub if we scale to multiple API instances.

### 3. Global `SyncProvider` in Mobile Root
We will wrap the application (or the Map feature) in a `SyncProvider`.
- **Rationale**: Centralizes all socket listeners in one place, preventing duplicate subscriptions and ensuring that cache invalidation happens globally regardless of which screen is active.

## Risks / Trade-offs

- **[Risk] Socket Disconnection** → **Mitigation**: Standard React Query `staleTime` and manual refresh remain as fallbacks. The system is "eventually consistent" even if the socket fails.
- **[Trade-off] Extra HTTP Request** → **Rationale**: By sending a signal and then fetching via HTTP, we make 2 calls instead of 1. However, this ensures that standard API features (like authentication, filtering, and logging) are applied to every data fetch.
