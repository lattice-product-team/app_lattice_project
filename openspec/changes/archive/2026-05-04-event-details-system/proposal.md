## Why

Users need a comprehensive and high-fidelity way to view details of a specific event (POI) without losing their current search context. Implementing a secondary "Detail Sheet" that stacks on top of the main discovery island allows for a deep-dive exploration while maintaining the "Apple Maps" experience where search results persist in the background.

## What Changes

- **Event Detail Architecture**: Introduction of a secondary floating sheet system that activates when an event is selected.
- **Visual Consistency**: The detail sheet will mirror the "Island" behavior: floating with rounded corners at Level 2 and edge-to-edge at Level 3.
- **State Persistence**: The main discovery/search island will preserve its state (search query, results) while the detail sheet is active.
- **Detail UI Components**:
  - Symmetrical header with "Share" and "Close (X)" buttons.
  - Quick Action row (Directions, Call, Website) with themed button styles.
  - Information grid (Hours, Ratings, Distance).
  - Expandable content (About section, images).

## Capabilities

### New Capabilities

- `event-detail-sheet`: A dedicated component and state logic for displaying POI details over the main interface.
- `quick-action-system`: A set of interactive buttons for common POI tasks (navigation, contact).

## Impact

- `apps/mobile/app/(main)/index.tsx` (State management for stacking sheets)
- `apps/mobile/src/features/map/components/EventDetailSheet.tsx` (New component)
- `apps/mobile/src/features/map/hooks/useEventDetails.ts` (Data fetching hook)
