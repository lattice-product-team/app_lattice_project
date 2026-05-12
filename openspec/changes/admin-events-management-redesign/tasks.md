## 1. Interface Cleanup and Prep

- [x] 1.1 Remove the "Archive All" button from `apps/admin-web/src/app/(admin)/events/page.tsx`
- [x] 1.2 Import `useRouter` and initialize it for navigation actions

## 2. Search and Filtering Implementation

- [x] 2.1 Add state for `searchTerm`, `statusFilter`, and `capacityFilter`
- [x] 2.2 Implement `filteredEvents` using `useMemo` to process the `events` list
- [x] 2.3 Add UI components for Search (Input) and Filters (Select/Tabs) in the toolbar section
- [x] 2.4 Update the table to render `filteredEvents` instead of the raw `events` list

## 3. Full-Screen Event Creator Redesign

- [x] 3.1 Replace the HeroUI `Modal` with a custom full-screen fixed `div` container
- [x] 3.2 Apply sharp corners (remove `rounded-*` classes) and Waldenburg heading styles
- [x] 3.3 Implement a prominent "X" close button in the top-right corner
- [x] 3.4 Adjust the layout to a dual-column format (Map on left, Form on right) for maximized workspace

## 4. Table Actions and Logic

- [x] 4.1 Implement "View" button logic to navigate to `/` with the event ID
- [x] 4.2 Implement "Manage" button logic to open the full-screen interface in "Edit" mode
- [x] 4.3 Ensure the "Edit" mode pre-populates the form with existing event data
- [x] 4.4 Verify all interactions (Create, Edit, Search, Filter) work seamlessly
