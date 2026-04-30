## 1. Data Layer & Hooks

- [x] 1.1 Create `useSearchHistory` hook using MMKV for persisting recent searches
- [x] 1.2 Implement `useSearchEvents` hook to fetch events from `/api/geo/events`
- [x] 1.3 Add filtering logic to the events hook for real-time results

## 2. UI Components

- [x] 2.1 Build `SearchExperience` container component
- [x] 2.2 Create `HistoryItem` component with "clock" icon and removal capability
- [x] 2.3 Create `EventResultItem` component following the Apple Maps list style
- [x] 2.4 Implement the "Clear All" history button UI

## 3. Island Integration

- [x] 3.1 Update `index.tsx` to handle `isSearching` state
- [x] 3.2 Implement conditional rendering to swap `DiscoveryDashboard` for `SearchExperience` in Level 3
- [x] 3.3 Ensure the transition is smooth and responds to search bar focus

## 4. Search Logic & Polish

- [x] 4.1 Implement `onSearchSubmit` to save queries to MMKV history
- [x] 4.2 Add "Select from History" logic to populate the search bar
- [x] 4.3 Add empty states for "No results found"
- [x] 4.4 Final design pass to match Apple Maps aesthetics (padding, dividers, typography)
