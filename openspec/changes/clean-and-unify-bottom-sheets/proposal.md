## Why

The application has pivoted from a circuit-specific navigation tool to a premium **Event Discovery Platform** (inspired by Uber, Airbnb, and Apple Maps). The current map interaction layer is fragmented and fails to handle the hierarchical relationship between events and their sub-locations. We need a unified system where the map remains clean (showing only Events) until a selection or zoom event triggers the "Explosion" of child POIs.

## What Changes

- **Legacy Cleanup**: Removal of orphaned components: `QuickActions.tsx`, `SheetFooterActions.tsx`, and `SaveLocationModal.tsx`.
- **"Zoom to Explore" Map Logic**: Refactor `MapContent.tsx` to show only Event icons by default. Upon selection, the camera will center on the bounding box of all associated child POIs.
- **Action Row Evolution**: Refactor `PoiDetailSheet.tsx` to introduce the "Action Trident": **Navigate**, **Get Tickets** (future-proofed for internal system), and **Add to Calendar**.
- **Saved Center Migration**: Redesign `SavedLocationsManager` from a Modal to a native `BottomSheet` with **Sharing Capabilities**.
- **Discovery Filters**: Add quick temporal filters ("Today", "This Weekend", "Upcoming") to the `MapBottomSheet`.
- **Category Update**: Migrate from circuit-specific terms to event-centric ones (Stage, Gallery, Stadium, Club, Fairground).

## Capabilities

### New Capabilities
- `event-poi-orchestration`: Manages the 1:N relationship and map visibility logic (Events visible by default, POIs visible on selection/zoom).
- `saved-discovery-management`: Handles saved events/venues and the new sharing functionality within the bottom sheet.

### Modified Capabilities
- `premium-sheet-interaction`: Extending the interaction model to support sticky action trident and temporal discovery filters.

## Impact

- **Components**: `MapBottomSheet.tsx`, `PoiDetailSheet.tsx`, `MapSheetManager.tsx`, `MapContent.tsx`.
- **Logic**: New camera orchestration and conditional rendering for map layers.
- **Styles**: Premium aesthetic alignment (Uber/Airbnb style) with standardized icons and glassmorphism.

