# Design: Dashboard Telemetry & UI Refinement

## 1. Backend Data Strategy

### 1.1 Global Stats (`getGlobalStats`)
We will replace the hardcoded values in `apps/server/geo/controllers/geo.controller.ts` with the following queries:

- **Live Users**: 
  ```sql
  SELECT count(DISTINCT user_id)::int 
  FROM telemetry_logs 
  WHERE timestamp > now() - interval '5 minutes'
  ```
- **Active Events**: Keep existing query.
- **Total Capacity**: 
  ```sql
  SELECT coalesce(sum(capacity), 0)::int 
  FROM points_of_interest 
  JOIN events ON points_of_interest.event_id = events.id
  WHERE events.end_date > now()
  ```
- **Active Alerts**:
  ```sql
  SELECT count(*)::int 
  FROM points_of_interest 
  WHERE (status = 'closed' OR crowd_level = 'blocked')
  AND event_id IN (SELECT id FROM events WHERE end_date > now())
  ```

### 1.2 Event-Specific Stats (`getEventStats`)
- **Estimated Capacity**: Sum of `capacity` for all POIs of that event.
- **Entry Rate**: Count of `telemetry_logs` for that `eventId` in the last 10 minutes, divided by 10.
- **Staff Online**: Count of POIs with type `security` or `medical` that are `open`.

## 2. Frontend Data Flow

### 2.1 Hook Alignment (`use-admin-data.ts`)
The `useEventStats` hook currently defaults to calling `/stats` (global) if no `eventId` is provided. We will modify this to:
1. Return a combined global state if `eventId` is missing.
2. Ensure the data structure returned by the backend matches what the hook expects (e.g., `estimatedCapacity` vs `totalCapacity`).

### 2.2 Dashboard Component (`Dashboard.tsx`)
- Implement a `fallback` state for `eventStats` to avoid "Synchronizing..." when data is missing or loading.
- Default to `0` or "--" instead of an infinite loading string for non-critical telemetry.

## 3. UI Refinement

### 3.1 Dashboard Header
- Remove the "Create New Event" and "System Logs" `Button` components from the header section.

### 3.2 Action Buttons
- **View Map**: Wrap the button in a `Link` or use `router.push` to navigate to `/map?eventId=${activeEvent.id}`.
- **Event Settings**: Link to `/events` (or a specific event detail page if implemented in the future).
