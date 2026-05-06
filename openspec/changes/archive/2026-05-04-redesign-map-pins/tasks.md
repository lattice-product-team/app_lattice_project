## 1. Store & Data Model Updates

- [x] 1.1 Update `usePOIStore.ts` to support `selectedEventId` and filtering state.
- [x] 1.2 Implement logic in the store to filter visible POIs based on the active event and category filters.
- [x] 1.3 Add geofencing detection to the store (using current user location).

## 2. Map Pin Components (Apple Style)

- [x] 2.1 Create `EventPin.tsx` using `MarkerView` with image support and adaptive labels.
- [x] 2.2 Implement selection state in `EventPin` (size increase and "pin tail" animation).
- [x] 2.3 Create `POIPin.tsx` as a minimalist glyph-based marker.
- [x] 2.4 Add 3D Billboarding logic to ensure pins stay vertical in tilted views.

## 3. Visibility & Focus Logic

- [x] 3.1 Implement hierarchical visibility in `MapContent.tsx` (reveal sub-POIs only when needed).
- [x] 3.2 Add automatic camera focus (bounding box) when an Event is selected.
- [x] 3.3 Implement "micro-pop" entrance animations for POI pins using `Reanimated`.

## 4. UI Refinement (Detail Sheets)

- [x] 4.1 Update `EventDetailSheet.tsx` to include the interactive "Quick Services" bar.
- [x] 4.2 Implement category highlighting/dimming logic between the sheet and the map markers.
- [x] 4.3 Create `POIMiniCard.tsx` and implement the transition logic (sliding between event/poi sheets).

## 5. Integration & Verification

- [x] 5.1 Final integration check in `MapContent.tsx`.
- [x] 5.2 Verify 3D mode behavior and pin legibility.
- [x] 5.3 Performance stress test with multiple events and POIs.
