## Why

The current architecture uses a redundant hierarchy: `Venue -> Event -> POIs`. In practice, the "Venue" (the physical stadium/circuit) only adds complexity without providing unique value that couldn't be handled by the Event entity itself. 

By flattening the structure, we achieve:
- **Simplified API**: No more 404s for missing venue layers.
- **Better Context**: POIs and navigation maps are directly linked to the experience (Event), allowing for different configurations for different events in the same physical space.
- **Reduced Technical Debt**: Elimination of unnecessary JOINs and shared state between venues and events.

## What Changes

- **Schema Flattening**:
    - Remove the `venues` table entirely.
    - Remove `venue_id` foreign keys from `events`, `points_of_interest`, `path_segments`, and `tickets`.
    - Add `is_permanent` (boolean) and `primary_color` (string) to the `events` table.
- **Service Updates**:
    - **Auth Service**: Update branding retrieval to fetch `primary_color` directly from the event.
    - **Geo Service**: Remove all `/venues` routes. Consolidate all spatial logic under `/events/:id/spatial`.
- **UI/App Updates**:
    - **Admin Web**: Remove Venue management pages. Update the Map Editor and Event Registry to be the primary entry points.
    - **Mobile App**: Eliminate `useVenueSpatial` hook. The app will now request all data (perímetro, POIs, navigation) via the event ID.

## Capabilities

### New Capabilities
- `permanent-event-support`: Allows marking events as perpetual (stadiums, permanent parks) to serve as long-term spatial containers.
- `event-branding-model`: Consolidates branding (colors, logos) directly into the Event entity, removing dependency on Venues.

### Modified Capabilities
- `spatial-sync-engine`: Transition from Venue-centric to Event-centric synchronization and persistence of GeoJSON boundaries and POIs.
- `event-poi-orchestration`: Flatten the hierarchy to ensure POIs and navigation graphs are managed strictly per Event context.

## Impact

- **Database**: Migration required to move existing venue data (center, boundary, color) into their associated events and remove the `venues` table.
- **API Gateway**: Removal of `/venues` proxying and fallback logic.
- **Mobile Client**: Breaking change in `geoService.ts` to fetch all spatial data via `eventId` instead of `venueId`.
- **Admin Dashboard**: Refactor Map Editor to use Event selection as the root context.
