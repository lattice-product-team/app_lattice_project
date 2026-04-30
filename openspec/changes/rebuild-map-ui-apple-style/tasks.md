## 1. Cleanup & Preparation

- [x] 1.1 Identify and remove legacy components (`MapHUD`, old `MapBottomSheet`, `PoiDetailSheet`).
- [x] 1.2 Simplify `useMapUIStore` to manage a single unified sheet state (`EXPLORING` vs `POI_DETAIL`).
- [x] 1.3 Clean up `(main)/index.tsx` to serve as a minimal container for the new architecture.

## 2. Structural Foundations

- [x] 2.1 Create `UnifiedMapSheet` with `detached={true}` and dynamic `bottomInset`.
- [x] 2.2 Implement `CustomIslandBackground` with standardized 32px borderRadius on all corners.
- [x] 2.3 Define the three Snap Points (Compact, Medium, Full) relative to screen height with safety margins.

## 3. Synchronized Overlays

- [x] 3.1 Implement `AdaptiveMapOverlay` using `Animated.View` to host all floating controls.
- [x] 3.2 Connect the overlay's `translateY` to the sheet's `animatedPosition` shared value.
- [x] 3.3 Rebuild `VerticalControlPill` (Recenter/Layers) and `BinocularsButton` with refined glass tokens.

## 4. Content Integration

- [x] 4.1 Integrate `FloatingSearchBar` as the persistent header for the unified sheet.
- [x] 4.2 Port event carousels and temporal filters to the new `ExplorerContent` view.
- [x] 4.3 Implement `PoiDetailContent` with the refined Action Trident engagement panel.

## 5. Verification & Polish

- [x] 5.1 Verify the "Island" gap is preserved across all snap points on different screen sizes.
- [x] 5.2 Test the synchronization of floating buttons during rapid sheet gestures.
- [x] 5.3 Validate haptic feedback implementation for all new interactive elements.
