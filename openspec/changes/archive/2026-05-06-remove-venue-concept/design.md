## Context

The current system forces a `Venue -> Event` hierarchy that creates unnecessary complexity in both the backend (multiple JOINs) and the frontend (dual context management). The mobile application is currently experiencing 404 errors due to missing endpoints for this redundant layer. We are moving towards a "Flat Experience" model where the Event is the primary unit of space, time, and branding.

## Goals / Non-Goals

**Goals:**

- Flatten the data model by removing the `venues` table.
- Consolidate spatial boundaries, center points, and branding colors into the `events` table.
- Ensure all POIs and Navigation data point directly to an `event_id`.
- Enable "Permanent Events" to represent physical locations that don't expire.

**Non-Goals:**

- Creating a nested event hierarchy (Event within Event).
- Redesigning the POI category system.
- Implementing global city-wide navigation in this phase.

## Decisions

### 1. Two-Phase Data Migration

**Decision**: Use a sequential migration strategy:

1. **Copy**: Transfer `boundary`, `center`, and `primary_color` from `venues` to their linked `events`.
2. **Re-link**: Update `points_of_interest` and `path_segments` that currently use `venue_id` to use the corresponding `event_id`.
3. **Drop**: Remove the `venues` table and foreign key constraints.
   **Rationale**: Ensures no data loss during the transition.

### 2. Branding Consolidation

**Decision**: Move `primary_color` directly to the `events` table.
**Rationale**: Currently, the Auth service joins with Venues just to get a hex code. Moving it to the Event simplifies the query and allows different events in the same location to have distinct identities (e.g., different sponsors).

### 3. Permanent Event Flag

**Decision**: Add an `is_permanent` boolean column to the `events` table.
**Rationale**: This distinguishes between a weekend race and the stadium itself. Permanent events will be filtered differently in the discovery UI (e.g., always visible).

## Risks / Trade-offs

- **[Risk] Data Loss** → **Mitigation**: Perform a dry-run of the migration script and verify counts before dropping the `venues` table.
- **[Risk] Mobile App Crashes** → **Mitigation**: Update the `geoService.ts` in the mobile app to remove calls to `/venues/*` and use `/events/*` exclusively before releasing the backend changes.
- **[Trade-off] Redundancy** → By moving venue data to events, some events in the same location might duplicate the boundary data. However, the gain in simplicity and decoupling far outweighs the minor storage overhead.
