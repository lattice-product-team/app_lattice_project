## Context

Currently, the Gateway and mobile app have a "dialect mismatch" in how they communicate errors. The Gateway uses a manual `res.writeHead` approach for proxy errors, which returns a flat `{ "error": "message" }` structure, while the mobile app's `apiClient` expects a nested `{ "error": { "user_friendly_message": "..." } }` structure. This leads to the app displaying "Unexpected server error" instead of useful diagnostic information. Furthermore, the Gateway is hitting proxy errors (502) with the Geo service, despite the Geo service being healthy and reachable via `wget`.

## Goals / Non-Goals

**Goals:**
- Align the Gateway's error handling with the `@app/core` standard.
- Update the mobile app to be resilient to both flat and nested error structures.
- Refactor the Gateway proxy to use the explicit `(filter, options)` signature of `http-proxy-middleware` v3 to address intermittent 502 errors.
- Improve diagnostic logging in the Gateway.

**Non-Goals:**
- Comprehensive refactor of the entire authentication flow.
- Implementation of a global retry policy for the mobile app (this can be a separate change).

## Decisions

### Decision: Align Gateway Error Handling with `@app/core`
The Gateway will be updated to use the standard `errorHandler` from `@app/core` for its own routes, and the proxy's `error` event handler will be refactored to produce the same structured JSON response.

**Rationale:** This ensures consistency across all services and simplifies error parsing in the frontend.

### Decision: Update `apiClient.ts` to be Agnostic of Error Structure
The `handleResponse` function in `apiClient.ts` will be updated to check for `data.error.message`, `data.error.user_friendly_message`, and `data.error` (as a string) in that order.

**Rationale:** This handles legacy, standard, and transitional error formats without crashing or obscuring the root cause.

### Decision: Use Explicit `(filter, options)` Signature for Gateway Proxies
The Gateway will use the `createProxyMiddleware(filter, options)` signature instead of passing the filter inside the options object.

**Rationale:** This is the recommended pattern for `http-proxy-middleware` v3 when used within an Express router and has been shown to be more stable in certain Node.js environments.

## Risks / Trade-offs

- **Risk**: Updating the Gateway proxy configuration might introduce new routing bugs if not carefully tested.
- **Mitigation**: Use `wget` and direct `curl`-style tests from within the container to verify each route after the change.
- **Risk**: Changing the error schema could break older versions of the mobile app (if we were in production).
- **Mitigation**: This is a development environment, and we are updating the current mobile app version in the same PR/change.
