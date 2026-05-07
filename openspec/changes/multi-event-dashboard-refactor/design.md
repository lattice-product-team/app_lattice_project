## Context

The previous redesign established the operational UI patterns but hardcoded the data to a single F1 event. To evolve into a platform, the dashboard must be refactored to support multiple venues and events dynamically.

## Goals / Non-Goals

**Goals:**

- Decouple all hardcoded strings (Event names, Gate IDs) from the UI.
- Implement a `Selector` pattern for switching between active venues and events.
- Implement a "Global Dashboard" view for cross-event monitoring.
- Maintain the HeroUI v3 aesthetic while increasing UI density for complex selections.

**Non-Goals:**

- Backend implementation of event switching APIs (UI will use local state and mock data mapping).
- Persistent state across sessions (localStorage/DB) for the active selection (out of scope).

## Decisions

### 1. State Management: Active Context

**Decision:** Use a local `activeEvent` state in `Dashboard` to drive all child components.
**Rationale:** Simple and sufficient for a single-page dashboard.
**Data Structure:**

```typescript
{
  id: string;
  name: string;
  venueName: string;
  status: 'LIVE' | 'PLANNING' | 'COMPLETED';
  type: 'sports' | 'festival' | 'conference';
}
```

### 2. UI Pattern: Double Selector

**Decision:** Use two HeroUI `<Select>` components in the header: one for Venue and one for Event.
**Rationale:** Hierarchical selection (Venue > Event) reflects the database schema (`events` table has `venue_id`).

### 3. Component Refinement: Generic Operations

**Decision:** Rename "Gate Status" to "Access Point Monitor" and "Spectators" to "Participants/Attendees" based on event type.
**Rationale:** Professional platforms use terminology that fits the customer's specific industry.

## Risks / Trade-offs

- **[Risk] State Desync** → **Mitigation**: Child components should be "pure" and receive data via props from the main dashboard state.
- **[Risk] UI Overload** → **Mitigation**: If more than 5 events are active, use a searchable `<Select>` or a Modal-based browser instead of a simple dropdown.
