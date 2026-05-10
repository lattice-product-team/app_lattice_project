## Context

The current architecture is a monolithic Node.js (Express) API serving a React (Next.js) Admin dashboard and an Expo (React Native) mobile app. We use Redis for caching and Valhalla for routing. Adding WebSockets requires a stateful layer that integrates with our stateless HTTP endpoints.

## Goals / Non-Goals

**Goals:**
- Implement a secure, scalable WebSocket server using Socket.io.
- Enable real-time data updates for the `admin-web` dashboard.
- Minimize battery/data usage on mobile via lifecycle-aware connections.
- Ensure horizontal scalability via Redis Pub/Sub.

## Decisions

### 1. Use Socket.io with Redis Adapter
- **Decision**: Use `socket.io` with `@socket.io/redis-adapter`.
- **Rationale**: Socket.io provides high-level abstractions for rooms, namespaces, and auto-reconnection. The Redis adapter allows multiple API instances to broadcast to all clients seamlessly. We will rely on Socket.io's built-in silent reconnection logic.

### 2. Notification-Only Strategy (Invalidation)
- **Decision**: The server will only emit lightweight notification events (e.g., `{ type: 'POI_UPDATED', id: 'uuid' }`) instead of sending full data payloads.
- **Rationale**: Reduces bandwidth usage and ensures the client always uses the standard REST API to fetch the most up-to-date, validated data. This keeps the socket logic simple and consistent with existing caching strategies (like React Query).

### 3. Room-Based Scoping
- **Decision**: Implement two primary room categories:
  - `admin`: For all administrative updates and system notifications.
  - `user:{id}`: For private, user-specific notifications.
- **Rationale**: Ensures data privacy and minimizes unnecessary traffic to unrelated clients.

### 4. Handshake Authentication (JWT)
- **Decision**: Validate JWT tokens during the `connection` handshake.
- **Rationale**: Prevents unauthorized socket connections from consuming server resources. Reuses existing auth logic.

### 5. Shared Socket Initialization (Singleton)
- **Decision**: Export a `getIO()` function or singleton from a dedicated `socket.ts` utility in the backend.
- **Rationale**: Allows any controller or service in the monolith to trigger broadcasts (e.g., after a database write) without direct access to the `server` object.

## Risks / Trade-offs

- **[Risk] Memory Consumption** → **Mitigation**: Implement strict connection timeouts and monitor the number of active sockets in Redis.
- **[Risk] Connection Flooding** → **Mitigation**: Rate limit connection attempts at the infrastructure/balancer level.
- **[Risk] Mobile Battery Drain** → **Mitigation**: Force socket disconnection when the app enters the background for more than 30 seconds.

## Migration Plan

1. Update `package.json` with new dependencies.
2. Implement `socket.ts` utility in the backend.
3. Integrate Socket.io into `index.ts`.
4. Create a basic "ping" test in the `admin-web`.
5. Deploy and monitor Redis load.
