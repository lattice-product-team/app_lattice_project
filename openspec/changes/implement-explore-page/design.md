## Context

The Lattice mobile app currently features a high-end map discovery experience but lacks a structured, curated entry point for users to explore events and places via a feed. The "Exploración" mode in the main screen's sliding canvas is currently a placeholder. This design introduces a server-orchestrated discovery feed that provides a rich, visually compelling gateway to the Lattice ecosystem.

## Goals / Non-Goals

**Goals:**
- Implement a server-driven discovery feed with multiple section types (Featured, Categories, Trending, Nearby).
- Maintain 100% theme consistency with existing light/dark modes.
- Abstract the feed logic so the client doesn't need to know how "trending" or "featured" items are calculated.
- Use existing detail sheets (`EventDetailSheet`) for item interactions.

**Non-Goals:**
- Implement the ticketing system (it remains a future phase).
- Sync Explore filters with the Map view (they will remain independent).
- Introduce new navigation screens for item discovery.

## Decisions

### 1. Server-Driven UI (SDUI) Approach
**Decision**: The `/v1/discovery` endpoint will return an array of `sections`, each with a `type` and its corresponding `items`.
**Rationale**: This allows the backend to change the order of sections, add new promotional carousels, or change ranking algorithms (e.g., "Trending") without requiring a mobile app update.
**Alternatives**: Hardcoding sections on the frontend and fetching individual endpoints for Events and POIs. Rejected because it's less flexible and increases client-side complexity.

### 2. Polymorphic Discovery Components
**Decision**: Create a `DiscoverySection` component that uses a registry to render different section types (e.g., `featured` → `HorizontalCarousel`, `trending` → `BentoGrid`).
**Rationale**: Promotes high reusability and clean code structure.
**Alternatives**: A single monolithic `ExploreScreen` with conditional rendering. Rejected due to maintainability concerns.

### 3. Data Orchestration Service
**Decision**: Implement a `DiscoveryService` in the backend that aggregates data from the `Event` and `POI` registries.
**Rationale**: Centralizes the logic for "what makes something trending" or "what is currently featured" in one place.
**Alternatives**: Performing these aggregations in the mobile app. Rejected to avoid hardcoding business logic on the client.

### 4. Styling with NativeWind and Theme Tokens
**Decision**: Use existing `theme` tokens and `NativeWind` for styling, specifically avoiding hardcoded colors from reference images.
**Rationale**: Ensures the new UI feels native to the Lattice design system.

## Risks / Trade-offs

- **[Risk] Payload Size** → **Mitigation**: Implement pagination for long vertical sections (like "Nearby Now") and limit the number of items in horizontal carousels.
- **[Risk] Performance with Complex Layouts** → **Mitigation**: Use `FlashList` if performance in the Bento Grid becomes an issue, though `ScrollView` with optimized items should suffice for Phase 1.
