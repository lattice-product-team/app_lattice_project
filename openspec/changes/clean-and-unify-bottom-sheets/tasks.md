## 1. Dead Code Removal (Cleanup)

- [ ] 1.1 Delete legacy components: `SheetFooterActions.tsx`, `QuickActions.tsx`, and `SaveLocationModal.tsx`.
- [ ] 1.2 Remove all imports and references to the deleted components in `MapHUD.tsx` and `MapSheetManager.tsx`.
- [ ] 1.3 Remove the legacy `SavedLocationsManager` modal usage from `index.tsx`.

## 2. State & Data Layer Updates

- [ ] 2.1 Update `useMapUIStore` to include the `SAVED_LIST` state.
- [ ] 2.2 Extend `UIPOI` model to support `parentId` (linking POIs to Events).
- [ ] 2.3 Implement `calculateBBox` utility to find the bounding box of a collection of child POIs.
- [ ] 2.4 Add logic to `MapContent.tsx` to center the camera on the bounding box when an Event is selected.

## 3. PoiDetailSheet Refactor (The Trident)

- [ ] 3.1 Create a `FixedActionRow` component inside `PoiDetailSheet.tsx`.
- [ ] 3.2 Implement the "Action Trident" buttons: **Navigate**, **Get Tickets**, and **Add to Calendar**.
- [ ] 3.3 Ensure the Trident remains sticky between the header and the `BottomSheetScrollView`.
- [ ] 3.4 Adjust snap points to ensure content visibility in "Medium" state.

## 4. MapBottomSheet & Saved Center Integration

- [ ] 4.1 Create `SavedListContent.tsx` with sharing capabilities for saved events/venues.
- [ ] 4.2 Update `MapBottomSheet.tsx` to switch between `DiscoveryContent`, `SearchResults`, and `SavedListContent`.
- [ ] 4.3 Implement `TemporalFilters` row (Today, Weekend, etc.) in the `MapBottomSheet` discovery view.

## 5. Orchestration & Final Polish

- [ ] 5.1 Update `MapSheetManager.tsx` to handle transitions to the new `SAVED_LIST` state.
- [ ] 5.2 Verify haptic feedback synchronization across all state changes.
- [ ] 5.3 Final visual audit: Ensure 0.5px "inner glow" and glassmorphism consistency.
