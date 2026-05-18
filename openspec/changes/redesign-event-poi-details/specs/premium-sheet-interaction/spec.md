## MODIFIED Requirements

### Requirement: The Action Trident Layout

The system SHALL implement a standardized action bar for all detail views. While it continues to prioritize the primary actions (Navigate, Tickets), it SHALL support a scrollable horizontal "pill" layout to accommodate additional context-aware actions (Website, Call, Offline).

#### Scenario: Trident availability

- **WHEN** viewing a POI or Event detail sheet
- **THEN** the system MUST display a horizontal bar of action pills:
  1. **Navigate**: Native routing to the location (Primary).
  2. **Tickets**: link to purchase/view entries (if applicable).
  3. **Contextual Actions**: Website, Call, or Offline mode toggle.
