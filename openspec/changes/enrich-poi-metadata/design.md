## Context
The Lattice platform currently treats Points of Interest (POIs) as static assets with minimal metadata. This creates a data imbalance where Events are highly interactive and data-rich, while POIs remain basic markers. To support operational requirements for high-traffic assets (parking, stages, entrances), we need to enrich the POI data model and its administrative visualization.

## Goals / Non-Goals

**Goals:**
- Extend the `points_of_interest` database table with location and operational fields.
- Overhaul the Admin POI Registry with a high-density, telemetry-aware interface.
- Implement automated reverse geocoding for POI addresses.
- Standardize metadata storage for POIs (website, rating, opening hours).

**Non-Goals:**
- Adding geographic boundaries (polygons) to POIs (these are inherited from the parent Event).
- Supporting image uploads for POIs.
- Refactoring the core geographic indexing logic.

## Decisions

### 1. Database Schema Expansion
**Decision:** Add `locationName`, `address`, `metadata`, `capacity`, `currentOccupancy`, and `status` to the `points_of_interest` table.
**Rationale:** These fields align POIs with the operational depth of the `events` table without adding unnecessary overhead like custom boundaries or images.

### 2. Automated Address Resolution
**Decision:** Reuse the existing `reverseGeocode` method in the Admin UI when creating or editing POIs.
**Rationale:** Eliminates manual data entry errors and ensures consistency across all geographic assets.

### 3. Metadata Storage (JSONB)
**Decision:** Use a JSONB column for `metadata` to store attributes like `website`, `rating`, and `openingHours`.
**Rationale:** Provides flexibility for different POI types while maintaining a clean core table structure.

### 4. Admin UI Pattern Reuse
**Decision:** Adopt the "high-density" table component used in the Events registry for the POI registry, featuring occupancy bars and accessibility icons.
**Rationale:** Consistent UI/UX across the admin dashboard and better visibility into asset health.

## Risks / Trade-offs

- **[Risk] Data Gaps** → Existing POIs will have null values for new fields. **Mitigation**: Add sensible defaults (e.g., status "Open") and allow nulls for extended metadata.
- **[Trade-off] Telemetry Load** → Real-time occupancy bars increase API polling/subscription load. **Mitigation**: Use throttled updates for the admin table.
