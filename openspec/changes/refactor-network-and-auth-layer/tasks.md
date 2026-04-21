## 1. Networking Infrastructure

- [ ] 1.1 Modify `apiClient.ts` to read token from MMKV and inject `Authorization` header.
- [ ] 1.2 Remove `token` parameter from all `apiClient` methods.
- [ ] 1.3 Update `handleResponse` to include basic 401 (Unauthorized) handling logic.

## 2. Service & Store Realignment

- [ ] 2.1 Move `useAuthStore.ts` from `src/hooks/` to `src/store/`.
- [ ] 2.2 Consolidate `auth.ts` and `authService.ts` into a single `authService.ts`.
- [ ] 2.3 Remove all manual token passing from `authService.ts` methods.
- [ ] 2.4 Update `geoService.ts` and other services to remove manual token parameters.

## 3. TanStack Query Migration

- [ ] 3.1 Create `useUserTickets.ts` query hook to replace `syncTickets`.
- [ ] 3.2 Create `useClaimTicket.ts` mutation hook to replace `claimTicket`.
- [ ] 3.3 Create `useUnclaimTicket.ts` mutation hook to replace `unclaimTicket`.
- [ ] 3.4 Slim down `useAuthStore.ts` by removing async actions and keeping only state setters.

## 4. UI Integration & Cleanup

- [ ] 4.1 Update authentication screens to use the new TanStack Query hooks.
- [ ] 4.2 Verify ticket claiming flow with the new architecture.
- [ ] 4.3 Remove unused `auth.ts` file.
