## 1. Context & State Management

- [ ] 1.1 Define a mock `events` and `venues` data array in `apps/admin-web/src/app/page.tsx`.
- [ ] 1.2 Implement `useState` to track `selectedVenue` and `selectedEvent`.
- [ ] 1.3 Create a helper function to filter event data based on the active selection.

## 2. Dynamic Selection UI

- [ ] 2.1 Import `Select` and `SelectItem` from `@heroui/react`.
- [ ] 2.2 Implement the Venue/Event selector in the header next to the title.
- [ ] 2.3 Style the selectors to be compact and consistent with the "rounded-full" aesthetic.

## 3. Dynamic Header & Metrics Cards

- [ ] 3.1 Refactor the header title to use `{selectedEvent.name}`.
- [ ] 3.2 Update the "Active Spectators" card to use dynamic labels (e.g., "Spectators" vs "Attendees").
- [ ] 3.3 Ensure card values (K, Alerts, %) change when the event context switches.

## 4. Adaptive Operations Table

- [ ] 4.1 Rename table title to "Access Point Status".
- [ ] 4.2 Implement conditional logic to change column labels based on `event.type`.
- [ ] 4.3 Update the mock data source for the table to be context-aware.

## 5. Validation & Cleanup

- [ ] 5.1 Verify that switching events updates the entire dashboard without runtime errors.
- [ ] 5.2 Run a final lint check to ensure code quality.
