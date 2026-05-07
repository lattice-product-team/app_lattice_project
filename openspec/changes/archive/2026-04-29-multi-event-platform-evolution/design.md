## Context

Lattice is currently a single-event navigation app. To support multiple events, we need to decouple the data from a global scope and associate it with specific event entities. This design focuses on the architecture for event discovery, dynamic themed UI, and accessibility-aware routing.

## Goals / Non-Goals

**Goals:**

- Implement a multi-event discovery carousel in the bottom sheet.
- Scope all POIs and routing data to a selected event.
- Enable offline data synchronization for selected events.
- Implement user accessibility preferences (e.g., avoid stairs) in the routing engine.
- Provide a clear "Remote Exploration" mode for users not physically present at an event.

**Non-Goals:**

- Real-time navigation for multiple concurrent events (only one active event at a time).
- In-depth event management (CMS) logic (to be handled by a separate web interface later).

## Decisions

### 1. Database Schema Evolution

We will introduce an `events` table and update the `points_of_interest` and `nodes` tables to include an `event_id`.

- **`events` Table**: `id`, `name`, `type` (Enum: music, tech, sports, food, generic), `location` (Point), `boundary` (Polygon), `metadata` (JSONB for category-specific info), `image_url`.
- **Foreign Keys**: `points_of_interest.event_id` and `nodes.event_id` will ensure data isolation.

### 2. Multi-State Bottom Sheet

The `MapBottomSheet` will handle three distinct visual states:

- **Discovery**: Shows `EventCarousel` when `currentEventId` is null.
- **Event Context**: Shows categories and event-specific "What's on" when an event is selected.
- **POI Detail**: Shows details for a selected point within the active event.

### 3. Dynamic Category-Based Theming

We will implement a `useEventTheme` hook that overrides the "Solar Gold" default with category-specific colors:

- **Music**: Purple (`#AF52DE`)
- **Tech**: Blue (`#007AFF`)
- **Food**: Orange (`#FF9500`)
- **Sports**: Red (`#FF3B30`)

### 4. Accessibility-Aware Routing Engine

The `useRoutingLogic` and server-side `geo` service will be updated to respect user preferences stored in the `users` table:

- **Preferences**: `avoidStairs`, `wheelchairAccessible`, `minDistance`.
- **Filtering**: The pathfinding algorithm will filter out `path_segments` that violate these constraints (e.g., segments where `hasStairs` is true).

### 5. Offline Package Management

Leverage `expo-file-system` and `MapLibre` offline managers to bundle event data:

- **Tiles**: Cache map tiles within the event `boundary`.
- **GeoJSON**: Pre-fetch and cache all POIs and path network for the `eventId`.

## Risks / Trade-offs

- **[Risk] Data Volume** → **Mitigation**: Only download event data upon explicit user request ("Download for Offline").
- **[Risk] Routing Performance** → **Mitigation**: Filtering nodes/edges on the fly may be slow; we will explore pre-calculating accessibility-specific networks if needed.
- **[Trade-off] Single Active Event** → We prioritize focus on the selected event to simplify the UI and reduce memory usage on mobile devices.
