## 1. Admin Hooks & Infrastructure

- [x] 1.1 Create `apps/admin-web/src/hooks/use-admin-data.ts` to centralize API fetching and response validation.
- [x] 1.2 Implement `useVenues` and `useEvents` hooks with built-in loading and error state management.

## 2. Dynamic Content Implementation (Web)

- [x] 2.1 Refactor `apps/admin-web/src/app/venues/page.tsx` to replace mock data with the `useVenues` hook.
- [x] 2.2 Refactor `apps/admin-web/src/app/events/page.tsx` to replace mock data with the `useEvents` hook.
- [x] 2.3 Implement skeleton loading states and "No Data Found" empty states across administrative tables.

## 3. Map Editor Synchronization (Web)

- [x] 3.1 Verify `MapEditorPage` persistence logic against live backend endpoints.
- [x] 3.2 Ensure venue selection in the Map Editor dropdown correctly reloads all associated spatial metadata (POIs, boundaries).

## 4. Mobile Discovery Synchronization

- [x] 4.1 Update `apps/mobile/src/services/geoService.ts` to prioritize live API data for POI and event discovery.
- [x] 4.2 Verify that spatial modifications in the Admin Web are reflected correctly in the mobile application's discovery interface.
