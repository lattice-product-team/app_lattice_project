## Why

The mobile application is experiencing a critical rendering crash (white screen) immediately after startup. This is caused by a `TypeError` in `DiscoveryFeed.tsx` where the `theme` object is `undefined` during the initial render phase. This crash prevents the application from completing its initialization, triggering a master safety timeout in the root layout and leaving the user with a non-functional interface.

## What Changes

- **Modified**: `DiscoveryFeed.tsx` will be updated to accept an optional `theme` prop to ensure stability during the initial mount.
- **Modified**: `DiscoveryFeed.tsx` will have an improved safety fallback for the theme object to prevent `TypeError` even if the context or prop is missing.
- **Modified**: `index.tsx` (MapIndexPage) will be updated to pass the verified `theme` object down to the `DiscoveryFeed` component.
- **Refined**: The initialization logic (`isReady` state) in `DiscoveryFeed` will be adjusted to ensure it doesn't attempt to access theme properties before they are guaranteed to be available.

## Capabilities

### New Capabilities

- None

### Modified Capabilities

- `map-discovery-platform`: Improve component resilience and theme stability during initial feed rendering.

## Impact

- **Affected Code**: `apps/mobile/src/features/discovery/components/DiscoveryFeed.tsx`, `apps/mobile/app/(main)/index.tsx`.
- **User Experience**: Resolves the startup crash and ensures the "Explore" greeting and feed load correctly on both first-time and returning sessions.
