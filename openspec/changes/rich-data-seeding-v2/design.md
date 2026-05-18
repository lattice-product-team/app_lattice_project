## Context

The system needs a more robust and realistic data set to validate the discovery UI and spatial queries. The current seed is too sparse. We will implement "Rich Seed v2" targeting specific categories and spatial density.

## Goals / Non-Goals

**Goals:**

- Implement 4 Event Categories: Music, Gastronomy, Tech, and Sports.
- Create 1-2 Events per category.
- Ensure each major location has 4-5 associated POIs of various types.
- Use easily identifiable placeholders for images.

**Non-Goals:**

- Finding real image assets (placeholders only).
- Refactoring the database schema.

## Decisions

### 1. Spatial Clustering

**Rationale**: To test the map density and clustering logic, POIs will be generated in small clusters around the event coordinates (radius < 500m).
**Alternative**: Random global distribution, which doesn't simulate real-world event sites well.

### 2. Category Mapping

**Rationale**: Align seed categories with the `IconMap` in `CategoryChips.tsx` and the `icon` property in the database.

- Music -> `music`
- Gastronomy -> `utensils`
- Tech -> `cpu`
- Sports -> `trophy`

### 3. Image Placeholder Strategy

**Rationale**: Instead of using random Unsplash images that might break or look generic, we will use formatted strings like `https://PLACEHOLDER.COM/IMAGE_MUSIC_1.JPG` for easy search-and-replace by the user.

## Risks / Trade-offs

- **[Risk]** Data Overload → **[Mitigation]** We will keep the total count manageable (6-8 events, ~30 POIs).
- **[Risk]** Coordinate Precision → **[Mitigation]** Ensure coordinates are centered around the user's primary testing area (based on current map state).
