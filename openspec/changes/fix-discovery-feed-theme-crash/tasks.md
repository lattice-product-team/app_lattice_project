## 1. Pass Theme as a Prop and Fix Parent Fallback

**Rationale**: `MapIndexPage` (the parent of `DiscoveryFeed`) had a broken `require` path for its theme fallback. Fixing this ensures the parent itself doesn't crash. Passing the resolved `theme` as a prop to `DiscoveryFeed` guarantees stability.

### 2. Force Explore Mode on Startup

**Rationale**: To ensure the most stable entry point, we are forcing the `screenMode` to `0` (Explore) on mount, bypassing the previous session's state for the initial view.

- [x] 1.1 Update `DiscoveryFeed` props interface to include an optional `theme` of type `LatticeTheme`.
- [x] 1.2 Modify `DiscoveryFeed` to prioritize the `theme` prop over the `useAppTheme()` hook.
- [x] 1.3 Update the theme safety fallback in `DiscoveryFeed` to ensure it correctly resolves even if both prop and context are missing.
- [x] 1.4 Wrap theme-dependent styles in the loading skeleton with optional chaining or safe defaults.

- [x] 2.1 Pass the already-resolved `theme` object from `MapIndexPage` to the `DiscoveryFeed` component.
- [x] 2.2 Fix the `require` path for the theme fallback in `MapIndexPage`.
- [x] 2.3 Force `screenMode` to `0` (Explore) on mount in `MapIndexPage`.
- [x] 2.4 Resolve "Loading Deadlock" by ensuring `MapContent` always renders (allowing `isInitialLoadComplete` to trigger).

## 3. Verification

- [x] 3.1 Run the app and verify the white screen crash is resolved on startup.
- [x] 3.2 Ensure the personalized greeting ("Good morning, Explorer/User") renders correctly in the Explore header.
- [x] 3.3 Verify that the loading skeleton appears briefly and safely before the feed content arrives.
