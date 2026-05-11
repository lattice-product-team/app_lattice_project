# Tasks: Dashboard Telemetry & UI Refinement

## 1. Backend: Real Telemetry Implementation

- [ ] 1.1 Update `getGlobalStats` in `apps/server/geo/controllers/geo.controller.ts` with real SQL queries for `liveUsers`, `totalCapacity`, and `activeAlerts`.
- [ ] 1.2 Update `getEventStats` in `apps/server/geo/controllers/geo.controller.ts` to calculate real metrics from `telemetry_logs` and `points_of_interest`.

## 2. Frontend: Data Integration & Bug Fixes

- [ ] 2.1 Update `useEventStats` in `apps/admin-web/src/hooks/use-admin-data.ts` to handle global stats correctly when no `eventId` is selected.
- [ ] 2.2 Fix the "Synchronizing..." hang in `apps/admin-web/src/app/(admin)/page.tsx` by providing proper fallback values.

## 3. Frontend: UI Cleanup

- [ ] 3.1 Remove "Create New Event" and "System Logs" buttons from `apps/admin-web/src/app/(admin)/page.tsx`.
- [ ] 3.2 Update "View Map" button in `apps/admin-web/src/app/(admin)/page.tsx` to link to `/map?eventId=[id]`.
- [ ] 3.3 Update "Event Settings" button in `apps/admin-web/src/app/(admin)/page.tsx` to link to `/events`.

## 4. Verification

- [ ] 4.1 Verify Dashboard shows non-zero live users (if seed data exists).
- [ ] 4.2 Verify "Synchronizing..." is replaced by real numbers or fallback zeros.
- [ ] 4.3 Test navigation from "View Map" button.
