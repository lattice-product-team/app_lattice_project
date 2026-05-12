## 1. Core State & Filtering Logic

- [x] 1.1 Update `usePOIStore.ts` to include category mapping logic in `getFilteredPOIs`.
- [x] 1.2 Implement the filtering logic in `getFilteredPOIs` to respect `activeCategoryFilters`.
- [x] 1.3 Add a helper function or selector in `usePOIStore` to get active category status.

## 2. Discovery Dashboard Enhancements

- [x] 2.1 Update `DiscoveryDashboard.tsx` to read `activeCategoryFilters` from `usePOIStore`.
- [x] 2.2 Update category chips in `DiscoveryDashboard` to reflect selected state visually.
- [x] 2.3 Modify the event carousel in `DiscoveryDashboard` to filter events based on active categories.
- [x] 2.4 Add haptic feedback to category chip selection in `DiscoveryDashboard`.

## 3. Main Screen Wiring

- [x] 3.1 Update `handleSelectCategory` in `index.tsx` to call `toggleCategoryFilter` from `usePOIStore`.
- [x] 3.2 Ensure `DiscoveryDashboard` is correctly receiving any necessary props if not using direct store access for everything.

## 4. Verification

- [ ] 4.1 Verify that selecting a category (e.g., "Música") filters the map markers immediately.
- [ ] 4.2 Verify that the same selection filters the events in the dashboard carousel.
- [ ] 4.3 Verify that filters are maintained when switching between Level 2 and Level 3 states.
- [ ] 4.4 Verify that "Clear All" or deselecting a category restores the full view.
