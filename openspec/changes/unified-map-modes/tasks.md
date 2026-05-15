## 1. State Store Refactoring

- [x] 1.1 Update `MapUIState` enum in `useMapUIStore.ts` to include `PLANNING` and `AR_EXPLORE` modes.
- [x] 1.2 Refactor `setUIState` action in `useMapUIStore` to trigger cross-store cleanup (clearing navigation in `useNavigationStore` and POI in `usePOIStore`).
- [x] 1.3 Update `useNavigationStore` and `usePOIStore` to remove redundant local visibility flags where they overlap with `uiState`.

## 2. Map Camera Orchestration

- [x] 2.1 Refactor `MapCameraManager.tsx` to use a single reactive transition handler instead of multiple fragmented `useEffect` hooks.
- [x] 2.2 Implement the "Safety Reset" protocol (synchronous `setCamera` with 0 duration and padding) before any programmatic move.
- [x] 2.3 Implement platform-specific `followUserMode` in `MapCameraManager` (Compass for Android, Course for iOS).
- [x] 2.4 Update `handleCameraChange` in `MapContent.tsx` with a 150ms throttle and gesture-lock for Android zoom updates.

## 3. UI Layer & Layer Integration

- [x] 3.1 Update `MapIndexPage` (`index.tsx`) to derive the `uiLayer` shared value directly from the global `uiState`.
- [x] 3.2 Refactor `MapLayers.tsx` to use `uiState` for deciding layer visibility (Routes, Events, etc.).
- [x] 3.3 Update `AdaptiveControlOverlay.tsx` and `DiscoveryDashboard.tsx` to respect the centralized mode state for visibility.

## 4. AR & Camera Optimization

- [x] 4.1 Ensure map rendering is minimized or hidden when `AR_EXPLORE` mode is active to preserve GPU resources.
- [x] 4.2 Standardize orientation and pitch calculations in `AROverlay.tsx` to ensure markers remain stable during fast movement.

## 5. Verification & Polish

- [ ] 5.1 Verify the full lifecycle: Explore -> Select POI -> Plan Route -> Navigate -> End Navigation on both iOS and Android.
- [ ] 5.2 Test Android-specific camera resilience by rapidly selecting and deselecting various POIs.
- [ ] 5.3 Audit re-render frequency in `MapContent` using React DevTools to confirm optimization.
