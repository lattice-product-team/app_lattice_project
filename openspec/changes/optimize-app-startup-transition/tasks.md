## 1. Global Infrastructure

- [x] 1.1 Ensure `useStartupStore` correctly tracks `isDataReady` and `isMapReady`.
- [x] 1.2 Implement the `AppSplashScreen` as a global overlay in `app/_layout.tsx`.
- [x] 1.3 Add a Reanimated-based fade-out animation to the global splash overlay (600-800ms).

## 2. Startup Logic Parallelization

- [x] 2.1 Refactor `app/index.tsx` to mount the main routes immediately after fonts are ready.
- [x] 2.2 Optimize pre-fetching in `app/index.tsx` to run concurrently with the initial navigation.
- [x] 2.3 Coordinate the `isDataReady` signal from the pre-fetching logic to the global store.

## 3. Map & Transition Refinement

- [x] 3.1 Verify `MapContent.tsx` reliably triggers the `isMapReady` state via `onDidFinishLoadingStyle`.
- [x] 3.2 Modify `MapLoadingOverlay.tsx` to suppress its internal spinner during the initial coordinated boot.
- [x] 3.3 Perform a final verification of the timing to ensure the splash hides ONLY after the map is visually stable.
