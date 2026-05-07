## Context

The search bar is currently a static UI element. To implement a functional search, we need a way to store recent history locally (MMKV) and a view that displays these results along with suggestions from the backend when the user is in Level 3 (Expanded) and focusing on the search input.

## Goals / Non-Goals

**Goals:**

- Provide an "Apple Maps" style search experience.
- Persist recent searches locally using MMKV.
- Fetch real events from the `/api/geo/events` endpoint.
- Transition the dashboard content to "Search Mode" when the input is focused.

**Non-Goals:**

- Full-text search engine (ElasticSearch/Algolia) for now; we will use simple string matching.
- Complex user profiles or synced search history across devices.

## Decisions

### 1. Persistence Layer: MMKV

- **Rationale**: MMKV is significantly faster than AsyncStorage and provides synchronous access, which is crucial for a smooth UI transition when the user taps the search bar.
- **Implementation**: A hook `useSearchHistory` will manage a string array `recent_searches` (max 10 items).

### 2. UI State Management

- We will introduce a `searchMode` state in `index.tsx`.
- **Search Mode Active**: Triggered when `islandState.value > 0.8` (Level 3) AND `isSearchFocused` is true.
- **Content**: The `DiscoveryDashboard` will be conditionally replaced or overlaid by a `SearchExperience` component.

### 3. Data Fetching

- We will use the existing `GET /api/geo/events` endpoint.
- **Optimization**: We'll fetch the list once and filter locally to ensure the "live search" feels instantaneous. If the list grows too large in the future, we will transition to backend-side filtering.

### 4. Component Structure

- `SearchExperience`: Main container for search state.
- `HistoryList`: Displays recent searches with a "Clear" button.
- `SuggestionsList`: Displays events from the backend.
- `ResultItem`: Shared UI for both history and event results.

## Risks / Trade-offs

- [Risk] → Memory bloat if the event list is too large for frontend filtering.
- [Mitigation] → Limit the number of items fetched or implement a simple `q` param in the backend later.
- [Risk] → Keyboard covering results.
- [Mitigation] → Use `KeyboardAvoidingView` or adjust the `islandScroll` padding dynamically.
