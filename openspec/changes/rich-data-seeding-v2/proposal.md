## Why

The current application data (seed) is limited and doesn't fully showcase the discovery and mapping capabilities. This change aims to populate the system with a "Rich Seed v2" containing realistic event categories, multiple events per category, and a high density of Points of Interest (POIs) per location to improve the user experience during development and testing.

## What Changes

- **Modified**: Database seeding scripts will be updated to include 4 distinct event categories.
- **Modified**: Each category will contain 1-2 high-fidelity events with metadata (ratings, descriptions, etc.).
- **Modified**: The spatial distribution of POIs will be increased to 4-5 POIs per major location/event site.
- **Modified**: POI categorization will be expanded to include diverse types (gastronomy, music, tech, etc.).
- **Refined**: All data will include placeholders for image URLs that can be easily updated by the user.

## Capabilities

### New Capabilities

- None

### Modified Capabilities

- `event-registry`: Update to support richer metadata and specific categories.
- `poi-registry`: Increase spatial density and categorization depth.

## Impact

- **Backend**: Affects `prisma/seed.ts` or equivalent seeding logic.
- **Frontend**: Improves the visual quality and density of the Discovery Feed and Map View.
