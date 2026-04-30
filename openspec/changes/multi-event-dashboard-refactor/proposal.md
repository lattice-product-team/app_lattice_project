## Why

Lattice is evolving from a single-event tool (F1-focused) into a comprehensive event management platform. The current dashboard is hardcoded for one specific event, which limits its utility for administrators managing multiple concurrent events or different types of venues (festivals, conferences, sports). This refactor will decouple the dashboard from specific event data and implement a flexible, context-aware interface.

## What Changes

- **Event/Venue Context Selectors**: Implement a dynamic selection mechanism to switch the dashboard view between different venues and active events.
- **Dynamic Header**: Replace hardcoded event names with data-driven titles reflecting the active selection.
- **Adaptive Metrics**: KPIs (Active Spectators, Alerts) will dynamically fetch and display data based on the selected event context.
- **Multi-Event Overview**: Introduce a "Global View" when no specific event is selected, showing high-level stats across all active events in the system.
- **Generalization of Data Structures**: Rename and refactor UI labels to be event-agnostic (e.g., "Gates" to "Access Points" or "Zones" depending on context).

## Capabilities

### New Capabilities
- `multi-event-orchestration`: Defines the logic for selecting and maintaining a "primary context" (Venue/Event) across the admin application.

### Modified Capabilities
- `event-operations-dashboard`: Update requirements to move from static event display to a dynamic, multi-context operational view.

## Impact

- **Affected Code**: `apps/admin-web/src/app/page.tsx`, `apps/admin-web/src/components/`
- **Context State**: Introduction of a client-side context or state management for the "Active Event".
- **API**: Future-proofing data fetching to include `eventId` and `venueId` parameters.
