## 1. Dead Code Removal (Cleanup)

- [x] 1.1 Delete legacy components: `SheetFooterActions.tsx`, `QuickActions.tsx`, and `SaveLocationModal.tsx`.
- [x] 1.2 Remove all imports and references to the deleted components in `MapHUD.tsx` and `MapSheetManager.tsx`.
- [x] 1.3 Remove the legacy `SavedLocationsManager` modal usage from `index.tsx`.

## 2. State & Data Layer Updates

- [x] 2.1 Update `useMapUIStore` to include the `SAVED_LIST` state.
- [x] 2.2 Extend `UIPOI` model to support `parentId` (linking POIs to Events).
- [x] 2.3 Implement `calculateBBox` utility to find the bounding box of a collection of child POIs.
- [x] 2.4 Add logic to `MapContent.tsx` to center the camera on the bounding box when an Event is selected.

## 3. PoiDetailSheet Refactor (The Trident)

- [x] 3.1 Create a `FixedActionRow` component inside `PoiDetailSheet.tsx`.
- [x] 3.2 Implement the "Action Trident" buttons: **Navigate**, **Get Tickets**, and **Add to Calendar**.
- [x] 3.3 Ensure the Trident remains sticky between the header and the `BottomSheetScrollView`.
- [x] 3.4 Adjust snap points to ensure content visibility in "Medium" state.

## 4. MapBottomSheet & Saved Center Integration

- [x] 4.1 Create `SavedListContent.tsx` with sharing capabilities for saved events/venues.
- [x] 4.2 Update `MapBottomSheet.tsx` to switch between `DiscoveryContent`, `SearchResults`, and `SavedListContent`.
- [x] 4.3 Implement `TemporalFilters` row (Today, Weekend, etc.) in the `MapBottomSheet` discovery view.

## 5. Orchestration & Final Polish

- [x] 5.1 Update `MapSheetManager.tsx` to handle transitions to the new `SAVED_LIST` state.
- [x] 5.2 Verify haptic feedback synchronization across all state changes.
- [x] 5.3 Final visual audit: Ensure 0.5px "inner glow" and glassmorphism consistency.
