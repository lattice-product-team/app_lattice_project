## Why

Currently, the database seeding is fragmented into multiple specific scripts (`montmelo`, `pedralbes`) that only populate isolated areas. This makes it difficult to test the new multi-event discovery features, cross-event navigation, and category-based theming in a unified environment. We need a single, robust "Master Seed" that populates a cohesive set of diverse events in Barcelona to ground our development in a realistic multi-event context.

## What Changes

- **Unified Seeding Script**: Consolidation of disparate seed files into a single `seed-master.ts` entry point.
- **Barcelona Multi-Event Dataset**: Introduction of three distinct events in Barcelona:
  - **Nitro GP** (Sports/Montmeló): A racing event focused on complex navigation and grandstands.
  - **Neon Nights Festival** (Music/Parc del Fòrum): A coastal festival focused on stages and accessibility.
  - **Quantum Conf** (Tech/Fira Gran Via): A professional congress focused on indoor routing and exhibition halls.
- **Categorized POIs & Nodes**: Each event will have its own isolated graph of points of interest and navigation nodes, strictly linked via `event_id`.
- **Accessibility Testing Data**: Deliberate inclusion of accessibility obstacles (stairs) and solutions (ramps) to verify the new routing engine logic.
- **Automatic Data Cleanup**: The master seed will handle cascading truncates to ensure a clean slate before populating data.

## Capabilities

### New Capabilities

- `unified-event-seeding`: Capability to populate a complete multi-event environment with isolated routing graphs and categorized POIs.

### Modified Capabilities

- `geo-data-management`: Requirements for POI and Node creation now include mandatory `event_id` assignment for multi-tenant event support.

## Impact

- **Database**: Cascading cleanup of `events`, `points_of_interest`, `nodes`, and `path_segments`.
- **Developer Workflow**: Simplification of environment setup with a single `npm run db:seed` command.
- **Testing**: Improved coverage for discovery carousels, category theming, and accessibility-aware routing.
