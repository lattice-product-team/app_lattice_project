## Context

The application currently follows a sequential startup pattern:
1. Native Splash Screen (iOS/Android)
2. `app/_layout.tsx` (Font loading)
3. `app/index.tsx` (Data pre-fetching + Custom Splash Screen)
4. `app/(main)/index.tsx` (Map initialization + Map Spinner)

This results in a "stutter" where the user sees a second spinner after the custom splash screen disappears.

## Goals / Non-Goals

**Goals:**
- Parallelize data pre-fetching with map engine initialization.
- Provide a seamless transition from the branding splash to the interactive map.
- Eliminate visible intermediate loading spinners during initial boot.
- Implement a smooth desvanece (fade-out) for the splash screen.

**Non-Goals:**
- Modifying the native splash screen assets.
- Changing the authentication logic.
- Optimizing subsequent map reloads (only initial boot).

## Decisions

### 1. Global Orchestration Store
We will utilize `useStartupStore` to track two critical flags:
- `isDataReady`: Set by `app/index.tsx` after TanStack Query pre-fetching completes.
- `isMapReady`: Set by `MapContent.tsx` after the MapLibre engine emits `onDidFinishLoadingStyle`.

**Rationale:** Using a centralized store allows the root layout to coordinate the visibility of the overlay regardless of which screen is currently mounted.

### 2. Parallel Route Mounting
Instead of waiting for data in `app/index.tsx` before redirecting, we will:
1. Check authentication status.
2. Immediately redirect to `(main)` or `(auth)`.
3. Allow the destination screen (Map) to start its native initialization while `index.tsx` logic continues to pre-fetch data in the background.

**Rationale:** Native map initialization is a heavy operation that should start as early as possible.

### 3. Root Overlay with Animated Exit
The `AppSplashScreen` will be rendered as a global overlay in `app/_layout.tsx`.
- **Visibility**: `!isDataReady || !isMapReady`.
- **Transition**: When conditions are met, the overlay will use a `react-native-reanimated` fade-out (opacity 1 -> 0) with a duration of 800ms.

**Rationale:** An overlay at the root level has the highest z-index, ensuring it covers the `Stack` and any internal screen loaders.

### 4. Suppression of Map Spinner on First Load
Modify `MapLoadingOverlay` to be aware of the "First Boot" state. If the global splash is still visible or just recently hidden, the map spinner should remain hidden to avoid visual clutter.

## Risks / Trade-offs

- **[Risk] Splash Stuck** → If the Map fails to load its style, the splash could stay visible forever. 
  - **Mitigation**: Retain the 2000ms safety timeout in `MapContent.tsx` that forces `isInitialLoadComplete` to true.
- **[Trade-off] Memory Usage** → Mounting the map earlier consumes more memory sooner.
  - **Mitigation**: This is acceptable for a "Map-First" application where the map is the primary interface.
