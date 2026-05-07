## Context

The current boot sequence is linear and blocked by remote network requests for styles that are now bundled locally. Furthermore, data fetching for the discovery experience only begins after the main layout is fully mounted, creating a visible "content pop-in" and extending the time until the user can interact with the app.

## Goals / Non-Goals

**Goals:**

- Eliminate all blocking remote network requests during the first 2 seconds of startup.
- Pre-warm the local style assets so the map engine initializes in <500ms.
- Pre-fetch the first page of POIs and Events to have them in memory when the Map component renders.
- Reduce perceived and actual Time to Interactive (TTI).

**Non-Goals:**

- Changing the backend API structure.
- Modifying the visual design of the splash screen.
- Implementing full offline support (out of scope, focused on startup performance).

## Decisions

1. **Parallel Execution (Root Layout)**: Instead of a linear sequence, we will launch `Asset.loadAsync` for the map JSONs and `queryClient.prefetchQuery` for data simultaneously as soon as the RootLayout mounts.
2. **Replacement of useMapStyle**: We will retire the `useMapStyle` hook completely. The logic for "cleaning" styles will be moved to a one-time build-step or a fast in-memory processor if needed, but given our recent local bundling, it should be a direct asset load.
3. **Data Pre-fetching in Index**: The `app/index.tsx` component will serve as a data-warming layer while it determines the navigation route (Auth vs Main).
4. **Splash Synchronization**: We will continue to use the font-loading state as the primary gate, but we will ensure that the "Ready" state in `index.tsx` doesn't block the UI rendering if data is still fetching in the background (using React Query's `stale-while-revalidate`).

## Risks / Trade-offs

- **Memory Usage** → [Risk] Loading large JSON styles into memory during boot could stress low-end devices. [Mitigation] We will only pre-load the style matching the current system appearance (Light/Dark).
- **Stale Data** → [Risk] Pre-fetching too early might show stale data if the user stays on the splash for long. [Mitigation] React Query handles cache invalidation automatically.
