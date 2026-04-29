## 1. Gateway Alignment

- [x] 1.1 Refactor `createServiceProxy` in `apps/server/gateway/index.ts` to use explicit `(filter, options)` signature.
- [x] 1.2 Update Gateway error handler in proxy's `on.error` to return structured JSON using `@app/core` schema.
- [x] 1.3 Add diagnostic logging for proxy `error` and `proxyReq` events.
- [x] 1.4 Ensure the Gateway uses the standard `errorHandler` middleware from `@app/core`.

## 2. Mobile App Resilience

- [x] 2.1 Update `handleResponse` in `apps/mobile/src/services/apiClient.ts` to support diverse error structures.
- [x] 2.2 Add unit tests for `handleResponse` with different mock error payloads.

## 3. Verification

- [x] 3.1 Verify Gateway can proxy to Auth service using `wget` within the container.
- [x] 3.2 Verify Gateway can proxy to Geo service using `wget` within the container.
- [x] 3.3 Trigger a simulated 502 error and verify the mobile app displays the correct error message.
