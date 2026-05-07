## Why

The current network layer requires manual token management and couples asynchronous logic within Zustand stores. This refactor aims to automate authentication headers, consolidate redundant services, and utilize TanStack Query for all asynchronous operations, improving performance tracking and developer experience.

## What Changes

- **Automated Auth Interceptor**: Update `apiClient` to automatically inject Bearer tokens from MMKV.
- **Service Consolidation**: Merge `auth.ts` and `authService.ts` into a single, clean service.
- **Async Logic Migration**: Move `claimTicket`, `unclaimTicket`, and `syncTickets` from `useAuthStore` to TanStack Query mutations/queries.
- **Architectural Realignment**: Move `useAuthStore` from `src/hooks/` to `src/store/` to align with project standards.
- **Simplified API Calls**: Remove `token` parameters from all service methods (**BREAKING** for internal calls).

## Capabilities

### New Capabilities

- `automated-api-auth`: Provides transparent authentication handling at the network level.
- `async-auth-mutations`: Standardizes authentication-related side effects using TanStack Query.

### Modified Capabilities

- `env-synchronization`: Update documentation if API configuration patterns change.

## Impact

- `apps/mobile/src/services/apiClient.ts`: Core logic for fetch wrapper.
- `apps/mobile/src/hooks/useAuthStore.ts`: Will be moved and slimmed down to only sync state.
- `apps/mobile/src/services/authService.ts`: Will become the single source of truth for auth calls.
- `apps/mobile/src/hooks/queries/`: New hooks for auth-related mutations.
