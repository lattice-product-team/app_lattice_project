## Why

The current Lattice application is limited to a single-event navigation experience with global data. To evolve into a versatile event platform, we must support multiple simultaneous festivals/events (Music, Tech, Sports, etc.), allow users to discover them through a premium interface, and ensure reliable navigation even in high-density areas with poor connectivity.

## What Changes

- **Discovery Layer**: Integration of a multi-event selection carousel within the main map bottom sheet.
- **Event-Scoped Data**: Architecture shift from global Points of Interest (POIs) and routing to event-linked datasets.
- **Visual Adaptability**: Dynamic UI theme adjustment (colors, icons) based on the selected event's category.
- **Offline Reliability**: Implementation of downloadable "Event Packages" containing tiles, POIs, and routing data.
- **Personalized Navigation**: Addition of user accessibility preferences (e.g., avoid stairs, wheelchair access) to customize routing.
- **Remote Awareness**: Intelligence to detect distance from event boundaries and provide "Remote Exploration" warnings.

## Capabilities

### New Capabilities

- `multi-event-discovery`: Logic and UI for browsing, selecting, and switching between active events.
- `offline-event-experience`: Capability to bundle and download event-specific data for offline usage.
- `accessibility-aware-routing`: Routing engine enhancement to respect user-defined physical constraints.

### Modified Capabilities

- `decoupled-location-management`: Update to handle event boundaries and distance-based feature gating.
- `granular-mobile-state`: Expand the global state to manage `currentEventId` and category-based theme tokens.

## Impact

- `packages/db`: Schema update to include `events` table and foreign key relationships in `points_of_interest`.
- `apps/server/geo`: API updates to filter all geo-data by `eventId`.
- `apps/mobile`: Refactor of `MapBottomSheet`, `useRoutingLogic`, and addition of a new `Profile` preferences section.
- `packages/types-schema`: New types for Event entities and Metadata.
