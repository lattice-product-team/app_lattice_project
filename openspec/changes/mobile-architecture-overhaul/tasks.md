## 1. Foundations: Unified Theme & Data Adapter

- [x] 1.1 Create `src/providers/ThemeProvider.tsx` and the `useAppTheme` hook.
- [x] 1.2 Implement `src/services/adapters/poiAdapter.ts` for standardized `UIPOI` models.
- [x] 1.3 Refactor `getCategoryMetadata` in `poiUtils.ts` to be used by the adapter.
- [x] 1.4 Update `SearchBar` and `CategoryChip` to consume the new unified theme.

## 2. Store Decomposition

- [x] 2.1 Create `src/store/useNavigationStore.ts` and migrate route/navigation state.
- [x] 2.2 Create `src/store/usePOIStore.ts` and migrate selection/POI state.
- [x] 2.3 Create `src/store/useMapUIStore.ts` and migrate sheet/HUD state.
- [x] 2.4 Update all component references from `useMapStore` to the new specialized stores.

## 3. Directory Restructuring (Feature-First)

- [ ] 3.1 Create `src/features/map` and move map-specific components.
- [ ] 3.2 Create `src/features/events` and migrate `EventCarousel`, `EventSummaryCard`, and related hooks.
- [ ] 3.3 Create `src/features/tickets` and migrate `TicketCard`, `ScanOverlay`, etc.
- [ ] 3.4 Ensure all imports are updated and path aliases are working correctly.

## 4. Component Consolidation & Cleanup

- [ ] 4.1 Merge `FloatingSearchBar` into the unified `SearchBar`.
- [ ] 4.2 Standardize all `Chips` and `Cards` to use the same atom from `src/components/ui`.
- [ ] 4.3 Remove unused/legacy components and old store files.
- [ ] 4.4 Final verification of the whole flow (Map -> Selection -> Navigation).
