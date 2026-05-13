## 1. Navigation Restructuring

- [ ] 1.1 Remove the branding logo and the divider from `apps/admin-web/src/components/floating-nav.tsx`.
- [ ] 1.2 Update `NAV_ITEMS` in `floating-nav.tsx` to contain only MAP, EVENTS, and POIS.
- [ ] 1.3 Change the MAP link destination from `/map` to `/` in `NAV_ITEMS`.

## 2. Root Route Migration

- [ ] 2.1 Replace the content of `apps/admin-web/src/app/(admin)/page.tsx` with the logic from `apps/admin-web/src/app/(admin)/map/page.tsx`.
- [ ] 2.2 Delete the `apps/admin-web/src/app/(admin)/map` directory and its contents.
- [ ] 2.3 Delete the `apps/admin-web/src/app/(admin)/radar` directory and its contents.
- [ ] 2.4 (Optional) Cleanup legacy `_bkp` directories if they interfere with build/routing.

## 3. Map Radar Integration

- [ ] 3.1 Update `AdminMap` in `apps/admin-web/src/components/map/admin-map.tsx` to include `Source` and `Layer` for heatmap visualization.
- [ ] 3.2 Implement a `radarData` prop in `AdminMap` to handle telemetry GeoJSON.
- [ ] 3.3 Add a "Radar" toggle button next to each event in the "Active Layers" panel of the new root page.

## 4. Telemetry & State Management

- [ ] 4.1 Implement state in the root page to track which events have active radar visualization.
- [ ] 4.2 Add polling logic (5s interval) to fetch telemetry data from `/api/v1/geo/locations?eventId=...` for all active radar events.
- [ ] 4.3 Merge multi-event telemetry into a single FeatureCollection for the heatmap layer.
- [ ] 4.4 Verify the end-to-end flow: Toggling radar on an event shows the heatmap on the global map.
