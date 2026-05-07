## MODIFIED Requirements

### Requirement: Operational Overview Cards

The system SHALL provide real-time metrics for "Active Spectators", "Active Alerts", and "Ticket Claimed Percentage" in a prominent summary section using standardized admin typography (14px values).

#### Scenario: Real-time Metric Updates

- **WHEN** telemetry data or ticket status changes in the database
- **THEN** the dashboard cards MUST reflect the updated values immediately (or via polling/revalidation) using the reduced font scale.

### Requirement: Gate Congestion Status

The dashboard SHALL include a table listing all active venue gates with their current crowd level (Low, Moderate, High, Blocked) and estimated wait times. The table SHALL use HeroUI v3 standards, including a designated `isRowHeader` column.

#### Scenario: Gate Status Identification

- **WHEN** a gate reaches a "High" or "Blocked" crowd level
- **THEN** the corresponding row in the table MUST be highlighted with a warning indicator.
