## 1. Infrastructure & Environment

- [ ] 1.1 Add `DATAFORSEO_LOGIN` and `DATAFORSEO_PASSWORD` to the root `.env` file.
- [ ] 1.2 Verify `axios` or `node-fetch` availability in the `@app/geo` service.

## 2. Core Service Implementation

- [ ] 2.1 Implement `DataForSEOClient` with basic authentication and search/reviews methods.
- [ ] 2.2 Create `SocialService` with the matching algorithm (name + proximity).
- [ ] 2.3 Implement the caching logic (7-day TTL check) for social data updates.

## 3. API & Persistence

- [ ] 3.1 Update Event and POI retrieval logic in `geo.controller.ts` to include the `social` metadata object.
- [ ] 3.2 Add a manual sync endpoint `/api/v1/geo/social/sync` for triggered updates.
- [ ] 3.3 Ensure the `metadata` JSONB updates correctly without overwriting other existing metadata fields.

## 4. Admin UI Overhaul

- [ ] 4.1 Update the Events table in `apps/admin-web/src/app/events/page.tsx` to display ratings and review counts.
- [ ] 4.2 Update the POIs table in `apps/admin-web/src/app/pois/page.tsx` with social proof indicators.
- [ ] 4.3 Add a "Google Maps CID/URL" input field to the POI Modal in the Map Editor for manual linkage.
