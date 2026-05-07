## MODIFIED Requirements

### Requirement: Operational Overview Cards

The system SHALL provide real-time metrics for "Active Spectators", "Active Alerts", and "Ticket Claimed Percentage" in a prominent summary section, sourced exclusively from live telemetry and database queries.

#### Scenario: Real-time Metric Updates

- **WHEN** telemetry data or ticket status changes in the database
- **THEN** the dashboard cards MUST reflect the updated values immediately (or via polling/revalidation) without relying on hardcoded initial states.
