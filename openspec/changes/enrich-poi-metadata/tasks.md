## 1. Database & Schema

- [x] 1.1 Update `points_of_interest` table in `packages/db/src/schema.ts` with new fields (`locationName`, `address`, `metadata`, `capacity`, `currentOccupancy`, `status`).
- [x] 1.2 Generate and run database migration to apply schema changes.
- [x] 1.3 Update seed data in `packages/db/src/seed-master.ts` to include `website`, `rating`, and `openingHours` in POI metadata.

## 2. API & Server Implementation

- [x] 2.1 Update POI DTOs/interfaces to include new enriched fields (excluding images/boundaries).
- [x] 2.2 Modify `geo.controller.ts` or relevant service to ensure the new fields are returned in API responses.
- [x] 2.3 Ensure `reverseGeocode` logic is accessible for POI operations.

## 3. Admin Web Overhaul

- [x] 3.1 Implement automated `reverseGeocode` call when a POI marker is placed or moved on the map.
- [x] 3.2 Update `apps/admin-web/src/app/pois/page.tsx` with high-density table rows.
- [x] 3.3 Add visual components: occupancy progress bars (current/capacity) and status chips.
- [x] 3.4 Add accessibility icons (wheelchair, priority) based on POI attributes.
- [x] 3.5 Verify real-time telemetry updates reflect in the admin table.
