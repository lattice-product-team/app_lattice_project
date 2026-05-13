## Why

The current "Exploración" screen in the mobile application is a placeholder with static text. To fulfill the product vision of being the "ultimate bridge between Barcelona's cultural scene and its residents", we need a high-impact, data-driven discovery experience. This page will serve as the primary entry point for users to find events and places without relying solely on the map view.

## What Changes

- **New Explore UI**: Implement a premium discovery interface based on the provided design, featuring:
  - **Featured Carousel**: High-impact horizontal scroll for major events.
  - **Category Quick-Filters**: Interactive chips (Music, Nightlife, Art, etc.) to quickly filter the view.
  - **Trending Places**: A curated grid of popular POIs.
  - **Nearby Now**: A real-time list of events and places sorted by proximity to the user.
- **Dynamic Data Orchestration**: Transition from placeholder text to a live data layer that aggregates Events and POIs.
- **Enhanced "Explore Mode"**: The sliding canvas will now host this rich discovery experience instead of a blank screen.

## Capabilities

### New Capabilities
- `discovery-feed-orchestrator`: Service and hook to aggregate and rank events/POIs for the Explore feed.
- `discovery-ui-components`: A library of premium components for the discovery feed (Carousels, Bento cards, etc.).
- `live-proximity-engine`: Logic to filter and sort "Nearby Now" items based on real-time location.

### Modified Capabilities
- `map-discovery-platform`: Update the coordination between the Map and Explore modes to ensure filters are synced.
- `event-registry`: Ensure the registry provides enough metadata for rich discovery cards (e.g., "Trending" status).

## Impact

- **Mobile App**: Significant update to `apps/mobile/app/(main)/index.tsx`.
- **API**: Potential need for new discovery-focused endpoints or query parameters in the Gateway.
- **Design System**: New design tokens or components in `src/components/ui`.
