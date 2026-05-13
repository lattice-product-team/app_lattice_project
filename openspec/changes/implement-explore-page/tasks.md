## 1. Backend (Discovery API)

- [x] 1.1 Extend the Event and POI models with `is_featured` and `is_trending` flags.
- [x] 1.2 Create a `DiscoveryService` in `apps/server/geo` to aggregate content.
- [x] 1.3 Implement the `GET /v1/discovery` endpoint with section-based orchestration.
- [x] 1.4 Add basic proximity sorting logic to the discovery service.

## 2. Frontend (Mobile) Data Layer

- [x] 2.1 Define TypeScript interfaces for the Polymorphic Discovery Feed.
- [x] 2.2 Implement the `useDiscovery` hook to fetch and cache the feed.
- [x] 2.3 Add location integration to the discovery hook for the "Nearby Now" section.

## 3. Frontend (Mobile) UI Components

- [x] 3.1 Build the `FeaturedCarousel` component with horizontal scroll and brand styling.
- [x] 3.2 Create the `CategoryChips` component for category-based feed filtering.
- [x] 3.3 Implement the `BentoGrid` layout for trending locations.
- [x] 3.4 Develop the `NearbyPlaceItem` with real-time proximity indicators.
- [x] 3.5 Create shimmer/skeleton loading states for each section type.

## 4. Integration & Polishing

- [x] 4.1 Replace the placeholder "Exploración" view in `(main)/index.tsx` with the new `DiscoveryFeed`.
- [x] 4.2 Map item press events to trigger the existing `EventDetailSheet`.
- [x] 4.3 Ensure 100% theme consistency across Light and Dark modes.
- [x] 4.4 Add micro-animations (entry transitions) to the feed items.
