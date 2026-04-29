## Why

The current API error handling in the mobile app is fragile and often obscures the actual root cause of failures (displaying "Unexpected server error" instead of the actual error from the gateway). Additionally, the Gateway service is experiencing intermittent 502 Bad Gateway errors when proxying to the Geo service, which is a critical path for the mobile app's startup and core functionality.

## What Changes

- **Standardized Error Responses**: Align the Gateway's manual proxy error responses with the standard `@app/core` error schema.
- **Resilient API Client**: Update the mobile app's `apiClient` to handle both structured and flat error responses from the backend services.
- **Robust Gateway Proxying**: Refactor the Gateway's proxy logic to use modern `http-proxy-middleware` v3 signatures and improve logging for connection-level errors.
- **Diagnostic Logging**: Enhance error logging in both the Gateway and the mobile app to include more context (e.g., target URL, original error message).

## Capabilities

### New Capabilities
- `error-standardization`: Ensures a consistent error response format across all backend services (Gateway, Auth, Geo, Social).

### Modified Capabilities
- `standards-alignment`: Updates the technical standards for how API errors are handled and reported within the system.

## Impact

- **Mobile App**: `apps/mobile/src/services/apiClient.ts`
- **Gateway Service**: `apps/server/gateway/index.ts`
- **Shared Core**: `packages/core/index.ts`
- **System Observability**: Improved diagnostic logs for debugging network and service-to-service communication issues.
