## Why

Currently, the category filters in the Level 2 Discovery Dashboard (the "Island" at 0.5 state) are not functional. While users can see and interact with category chips, these interactions do not affect the map or the event carousel within the dashboard. This creates a disconnected experience where filters appear available but have no impact on the discovery process.

## What Changes

- **Unified Filter State**: Centralize category filter state in `usePOIStore` to be shared across the Map, Discovery Dashboard, and Carousel components.
- **Interactive Dashboard Chips**: Update the category chips in `DiscoveryDashboard` to toggle filters in the global store.
- **Map Synchronization**: Update the map rendering logic to respect active category filters, hiding or dimming POIs that do not match the selection.
- **Carousel Synchronization**: Filter the "Events Carousel" in the Discovery Dashboard to only show events matching the selected category.
- **Persistence & Reset**: Ensure filters are cleared or maintained appropriately when navigating between different UI states (e.g., entering/exiting Level 3 search).

## Capabilities

### New Capabilities

- `unified-discovery-filtering`: Defines the requirements for synchronized filtering across map and dashboard layers.

### Modified Capabilities

- `poi-category-filtering`: Expand requirements to include the Discovery Dashboard as a source of filters and the Carousel as a target of filtering.

## Impact

- **Stores**: `usePOIStore.ts` will need updated logic for `getFilteredPOIs` and state management.
- **Components**: `DiscoveryDashboard.tsx`, `MapContent.tsx`, and `EventCarousel.tsx` (or its equivalent in the dashboard).
- **Hooks**: `useSearchEvents.ts` may need to support filtering by category.
- **UI/UX**: Consistent visual feedback for selected filters across different layers of the application.
