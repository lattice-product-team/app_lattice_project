## 1. Store Persistence Setup

- [x] 1.1 Update `useLocationStore.ts` to include `persist` middleware from `zustand`
- [x] 1.2 Configure persistence with `react-native-mmkv` using `mmkvStorage` from `src/services/storage.ts`
- [x] 1.3 Implement manual pre-hydration from MMKV to ensure coordinates are available on first render
- [x] 1.4 Verify that `coords` and `logicalCoords` are correctly saved and rehydrated on app restart

## 2. Map Camera Initialization Fix

- [x] 2.1 Update `MapCameraManager.tsx` to prioritize `userCoords` in `defaultSettings` of `MapLibreGL.Camera`
- [x] 2.2 Ensure `MAP_CENTER` is only used as a final fallback when both `userCoords` and `lastCameraPosition` are null

## 3. Location Service Optimization

- [x] 3.1 Review `useLocationService.ts` to ensure `getLastKnownPositionAsync` is called as early as possible
- [ ] 3.2 Verify that the first location update after mount doesn't cause an unwanted animated transition if it's identical to the persisted location

## 4. UI Polish & Refinements

- [x] 4.1 Remove dynamic event category colors from `ThemeProvider.tsx` to keep UI neutral/consistent
- [ ] 4.2 Verify that `EventDetailSheet` and `POIMiniCard` use the base brand primary color

## 5. Verification

- [ ] 4.1 Test app startup with existing location data: Verify map starts directly at user position
- [ ] 4.2 Test app startup with no location data (fresh install): Verify map starts at Madrid fallback
- [ ] 4.3 Test location permission denial: Verify map stays at fallback
