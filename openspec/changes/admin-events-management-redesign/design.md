## Context

The `/events` page currently uses a standard HeroUI Modal for event creation. While functional, it is visually constrained. Navigation buttons within the event list table are currently placeholders. The application uses `useEvents` for data fetching, which returns the full list of events.

## Goals / Non-Goals

**Goals:**

- Implement client-side search and filtering for the event list.
- Replace the modal with a full-screen `Overlay` or a custom absolute-positioned container.
- Connect "View" and "Manage" buttons to their respective functional flows.
- Enforce sharp corners and Waldenburg typography on all new UI elements.

**Non-Goals:**

- Server-side search/filtering (client-side is sufficient for the current scale).
- Persistent filter state (resetting on refresh is acceptable).
- Batch archiving or bulk operations.

## Decisions

### 1. Full-Screen Interface: Custom Absolute Container vs. Portal

- **Decision**: Use a custom fixed-position container that covers the entire screen, triggered by a state boolean (`isInterfaceOpen`).
- **Rationale**: Provides more control over the "no-rounded-corners" requirement and avoids the "modal" feel. It allows for a more "application-within-an-application" UX.
- **Alternatives**: Using HeroUI's `Modal` with `size="full"` (harder to strip all rounded corners and default animations).

### 2. Client-Side Filtering with `useMemo`

- **Decision**: Implement filtering logic using `useMemo` based on the data returned by `useEvents`.
- **Rationale**: Extremely fast and simple to implement without modifying the backend or hook logic.
- **Alternatives**: Passing filter parameters to the API (adds unnecessary latency for small datasets).

### 3. Navigation with `router.push` and Query Params

- **Decision**: Use `router.push('/')` for the "View" action, optionally passing `eventId` to the dashboard.
- **Rationale**: Leverages Next.js navigation and allows the dashboard to set its initial state based on the URL.

## Risks / Trade-offs

- **[Risk]** Full-screen interface blocking all interaction → **Mitigation**: Ensure a prominent "X" close button and ESC key listener are implemented.
- **[Trade-off]** Client-side filtering only works for loaded data → **Mitigation**: This is acceptable given the expected number of events (<100) managed by the admin.
