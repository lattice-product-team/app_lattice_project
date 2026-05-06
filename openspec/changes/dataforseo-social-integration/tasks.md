## 1. Infrastructure & Environment

- [x] 1.1 Add `DATAFORSEO_LOGIN` and `DATAFORSEO_PASSWORD` to the root `.env` file.
- [x] 1.2 Verify `axios` or `node-fetch` availability in the `@app/geo` service.

## 2. Core Service Implementation

- [x] 2.1 Implement `DataForSEOClient` with basic authentication and search/reviews methods.
- [x] 2.2 Create `SocialService` with the matching algorithm (name + proximity).
- [x] 2.3 Implement the caching logic (7-day TTL check) for social data updates.

## 3. API & Persistence

- [x] 3.1 Update Event and POI retrieval logic in `geo.controller.ts` to include the `social` metadata object.
- [x] 3.2 Add a manual sync endpoint `/api/v1/geo/social/sync` for triggered updates.
- [x] 3.3 Ensure the `metadata` JSONB updates correctly without overwriting other existing metadata fields.

## 4. Admin UI Overhaul

- [x] 4.1 Update the Events table in `apps/admin-web/src/app/events/page.tsx` to display ratings and review counts.
- [x] 4.2 Update the POIs table in `apps/admin-web/src/app/pois/page.tsx` with social proof indicators.
- [x] 4.3 Add a "Google Maps CID/URL" input field to the POI Modal in the Map Editor for manual linkage.
