## Why

The current search experience in the "Midnight Island" is purely visual and lacks functional utility. Users expect to see their recent search history and relevant event suggestions immediately upon entering Level 3, similar to the premium experiences found in Apple Maps and Google Maps. Implementing a persistent, fast-access search state using MMKV will significantly improve user engagement and event discovery.

## What Changes

- **Functional Search Level 3**: Transition the "Midnight Island" content from the Discovery Dashboard to a Search Experience view when the search bar is focused or active in Level 3.
- **Recent Searches Persistence**: Implement a local history storage using `react-native-mmkv` to keep track of the user's last searches.
- **Dynamic Event Suggestions**: Integrate with the backend to fetch and display a list of "Available Events" or "Recommended for You" when the search query is empty.
- **Clear History Capability**: Allow users to manage their privacy by clearing their recent search history.
- **UI Refinement**: Create new list-based components for search results that follow the established "Apple-style" light/dark theme aesthetics.

## Capabilities

### New Capabilities
- `search-history-management`: Logic for saving, retrieving, and clearing searches using MMKV.
- `search-results-ui`: High-performance list components for displaying history, suggestions, and live search results.

### Modified Capabilities
- `map-interface`: Update Level 3 transition logic to prioritize the search experience when the input is focused.

## Impact

- `apps/mobile/src/features/map/components/SearchExperience.tsx` (New component)
- `apps/mobile/src/features/map/hooks/useSearchHistory.ts` (New hook)
- `apps/mobile/app/(main)/index.tsx` (Integration of the search view)
- `apps/mobile/src/hooks/useMMKV.ts` (Shared storage utility)
