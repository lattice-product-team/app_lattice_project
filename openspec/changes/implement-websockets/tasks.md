## 1. Backend Infrastructure

- [x] 1.1 Install dependencies (`socket.io`, `@socket.io/redis-adapter`, `redis`) in `@app/api`
- [x] 1.2 Create `apps/server/api/src/services/socketService.ts` (or equivalent) to manage the IO singleton
- [x] 1.3 Integrate Socket.io server into the main HTTP server in `index.ts`
- [x] 1.4 Configure the Redis adapter using existing environment variables

## 2. Security & Handshake

- [x] 2.1 Implement JWT validation middleware for the Socket.io handshake
- [x] 2.2 Create an `authenticated` room logic to separate public vs private messages
- [x] 2.3 Implement authorization check for the `admin` namespace/room

## 3. Admin Web Integration

- [x] 3.1 Install `socket.io-client` in `apps/admin-web`
- [x] 3.2 Create a `useSocket` hook or context provider in the admin dashboard
- [x] 3.3 Implement real-time listeners for POI/Event updates in relevant views
- [x] 3.4 Verify that updates trigger UI state changes (Zustand/React Query)

## 4. Mobile Hook & Lifecycle

- [x] 4.1 Install `socket.io-client` in `apps/mobile`
- [x] 4.2 Create a background-aware socket hook in the mobile app
- [x] 4.3 Implement a basic "online" indicator or ping test to verify connectivity
