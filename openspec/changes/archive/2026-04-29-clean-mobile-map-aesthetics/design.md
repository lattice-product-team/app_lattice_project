## Context

The current `MapContent.tsx` implementation uses a simple URL string for `mapStyle`. However, to hide specific elements like highway shields and ferry lines without losing the entire transportation layer, we need granular control over the style's `layers` array. Since `setLayoutProperty` is unavailable in the React Native ref, we must pivot to a "Style Patching" strategy.

## Goals / Non-Goals

**Goals:**

- Eliminate all base map POI icons.
- Hide ferry lines and route labels.
- Suppress highway shields while keeping road names.
- Ensure the solution is performant and handles theme changes correctly.

**Non-Goals:**

- Creating a separate backend service for style hosting.
- Modifying the underlying vector data.

## Decisions

### 1. Implement Style Patching via `useMemo` and `useEffect`

- **Rationale**: By fetching the style JSON and modifying it in React state/memo, we can pass a modified object to the `mapStyle` prop. This gives us 100% control over the layer visibility before the map even renders them.
- **Alternatives**: Using `setSourceVisibility` (not granular enough for shields) or trying to override layers with components (too complex and prone to ID collisions).

### 2. Layers to Suppress

- **POIs**: All layers where `source-layer` is `poi`.
- **Ferries**: `Ferry line` and `Ferry`.
- **Highway Shields**: Any layer containing `Highway shield`.
- **Rationale**: These IDs have been verified against the MapTiler Streets v2 style specification.

### 3. Asynchronous Style Loading

- **Rationale**: Since we need to fetch the JSON, we will implement a loading state or fallback to ensure the UI remains smooth while the patched style is being prepared.

## Risks / Trade-offs

- **[Risk]** Fetching the JSON adds a small delay on initial load. → **Mitigation**: The JSON is relatively small (~60KB) and can be cached. We can also pre-fetch it.
- **[Trade-off]** If the MapTiler key or style URL changes, the fetch might fail. → **Mitigation**: Implement robust error handling and fallback to the original URL if patching fails.
