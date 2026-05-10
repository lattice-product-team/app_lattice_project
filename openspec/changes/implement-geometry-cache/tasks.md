## 1. Redis Shared Infrastructure

- [x] 1.1 Create `apps/server/api/redis.ts` singleton service
- [x] 1.2 Refactor `apps/server/api/socket.ts` to use the shared Redis service
- [x] 1.3 Verify Redis connection health on startup

## 2. Geometry Caching Logic

- [x] 2.1 Implement `getCache` and `setCache` helpers with fallback logic
- [x] 2.2 Implement `X-Cache` header logic in responses
- [x] 2.3 Update `getPois` in `geo.controller.ts` to use caching
- [x] 2.4 Update `getEventSpatial` in `geo.controller.ts` to use caching
- [x] 2.5 Verify cache population in Redis via `redis-cli` or logs

## 3. Reactive Invalidation

- [x] 3.1 Implement `clearGeoCache` utility for specific keys
- [x] 3.2 Add invalidation logic to `createPoi`
- [x] 3.3 Add invalidation logic to `saveEventSpatial`
- [x] 3.4 Add invalidation logic to `createEvent`

## 4. Verification

- [x] 4.1 Benchmark response times (Cache Miss vs Cache Hit)
- [x] 4.2 Verify that Admin updates correctly clear the mobile map view
