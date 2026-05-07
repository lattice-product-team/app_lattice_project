## Context

The mobile application uses `MMKV` for fast, synchronous storage and `Zustand` for state management. Currently, the `apiClient` is a simple `fetch` wrapper that requires tokens to be passed as arguments, leading to boilerplate and potential inconsistencies. Authentication logic is also scattered between `useAuthStore` and various service files.

## Goals / Non-Goals

**Goals:**

- Implement a token-aware `apiClient`.
- Decouple API side effects from Zustand state.
- Standardize the location of stores in `src/store/`.
- Provide a seamless migration path for existing services.

**Non-Goals:**

- Swapping `fetch` for `Axios` (keep the footprint small).
- Implementing OAuth2/Refresh token logic (out of scope for this refactor).
- Changing the backend API contracts.

## Decisions

### 1. Synchronous Token Retrieval

The `apiClient` will read the token directly from `MMKV` before each request.

- **Rationale**: Since `MMKV` is synchronous, we can inject the header without making the `apiClient` logic more complex with `async` initialization.
- **Implementation**: `const token = storage.getString('auth-token');` inside the request builder.

### 2. TanStack Query for Auth Actions

`claimTicket` and `syncTickets` will move to `useMutation` and `useQuery` respectively.

- **Rationale**: Provides out-of-the-box support for loading states, error handling, and cache invalidation (e.g., refetching the wallet after claiming a ticket).

### 3. Store Location Normalization

`useAuthStore.ts` moves to `src/store/`.

- **Rationale**: Consistency with `useMapStore.ts` and `useLocationStore.ts`.

## Risks / Trade-offs

- **[Risk]** Circular dependencies between `apiClient` and `authStore`.
  - **Mitigation**: `apiClient` will read from `MMKV` directly, avoiding a dependency on the `useAuthStore` hook.
- **[Risk]** Breaking changes in existing services.
  - **Mitigation**: Update all services in a single pass as part of this change.
