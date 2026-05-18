## Why

The current events management page has several UX issues: navigation buttons are non-functional, the "Archive All" action is redundant, and there is no way to search or filter the event list. Additionally, the event creation modal is too small and feels disconnected from the platform's editorial aesthetic.

## What Changes

- **Functional Navigation**: Fix "View" and "Manage" buttons to navigate to the dashboard and open the edit interface respectively.
- **Search & Filtering**: Implement real-time search by event name and filters for status (Active/Past) and capacity.
- **Full-Screen Creation Interface**: Redesign the "Create New Event" modal into a full-screen overlay with sharp corners and a prominent close button.
- **Interface Cleanup**: Remove the "Archive All" button from the header.
- **Unified Aesthetic**: Ensure all new components follow the "Waldenburg" editorial design language.

## Capabilities

### New Capabilities

- `event-search-filtering`: Ability to search and filter events in the admin dashboard.
- `full-screen-event-creator`: A dedicated, high-aesthetic interface for initializing and editing event lifecycles.

### Modified Capabilities

- `event-operations-dashboard`: Update requirements for event management actions and list behavior.

## Impact

- **apps/admin-web**: Significant UI/UX updates to the `/events` page and its associated modal/overlay components.
- **apps/admin-web/hooks**: Potential updates to the `useEvents` hook or local state management for filtering.
