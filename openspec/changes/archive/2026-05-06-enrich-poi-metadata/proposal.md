## Why
Currently, Points of Interest (POIs) in the Lattice ecosystem lack the data depth and visual fidelity that Events provide. While Events have images, detailed schedules, and rich telemetry (occupancy, status), POIs are restricted to basic categorization and naming. This disparity limits the administrative ability to monitor critical assets (like parking capacity or stage status) and degrades the end-user experience when navigating services.

## What Changes
- **Database Schema Expansion**: Add fields for `locationName`, `address`, `metadata` (JSON), `capacity`, `currentOccupancy`, and `status` to the `points_of_interest` table.
- **Admin UI High-Density Table**: Redesign the POI registry in the admin dashboard to include live occupancy telemetry (progress bars), accessibility indicators, and professional asset IDs (e.g., POI-001).
- **Auto-Location Resolution**: Integrate the system's `reverseGeocode` method to automatically resolve coordinates to human-readable addresses for POIs.
- **Metadata Enrichment**: Support for flexible data including `website`, `rating`, and `openingHours` within the POI metadata field.

## Capabilities

### New Capabilities
- `poi-telemetry`: Real-time occupancy, capacity management, and operational status tracking for fixed assets.
- `poi-metadata-registry`: Support for flexible metadata (website, rating, openingHours, tags) for POIs.
- `poi-registry-enhancement`: Extension of the core POI registry with human-readable location data (auto-geocoded) and high-density admin visualization.

## Impact
- **Backend/DB**: `packages/db/src/schema.ts` (table modification) and associated migrations.
- **Frontend**: `apps/admin-web/src/app/pois/page.tsx` (UI overhaul), `hooks/use-admin-data.ts` (data fetching updates).
- **API**: `apps/server/geo/controllers/geo.controller.ts` (payload enrichment).
