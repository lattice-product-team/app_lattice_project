## Why

The current administration and monitoring systems rely on manual refreshing or polling to display new data (POIs, events, or user activity). To provide a premium, reactive experience, we need a bi-directional communication layer that allows the server to "push" updates as they happen, specifically for the `admin-web` dashboard.

## What Changes

- **Core Infrastructure**: Implementation of a Socket.io server integrated into the existing monolithic API.
- **Scaling Layer**: Integration of the Socket.io Redis Adapter to leverage the existing Redis instance, ensuring the system can scale horizontally across multiple API instances.
- **Security & Auth**: WebSocket handshake authentication using existing JWT tokens. Implementation of an authorization middleware to restrict access to specific channels (e.g., sensitive admin data).
- **Admin Integration**: Real-time synchronization of the `admin-web` data tables and maps without requiring page reloads.
- **Mobile Lifecycle Management**: Implementation of a "Foreground-Aware" socket hook in the mobile app to minimize battery and data consumption when the app is in the background.

## Capabilities

### New Capabilities

- `realtime-infrastructure`: Core WebSocket server setup, Redis integration, and authentication middleware.
- `realtime-admin-sync`: Implementation of real-time update channels for the admin dashboard (e.g., `admin:pois:updated`, `admin:events:new`).

### Modified Capabilities

- `admin-api-integration`: Adding real-time event support to the admin data fetching strategy.

## Impact

- **Backend API**: New dependency on `socket.io` and `@socket.io/redis-adapter`. New initialization logic in `app.ts`.
- **Admin Web**: Integration of a socket client and state synchronization logic.
- **Mobile App**: New socket hook for real-time features (optional for now, but infrastructure will be ready).
- **Security**: Handshake validation will use the same secret/public key logic as the REST API.
