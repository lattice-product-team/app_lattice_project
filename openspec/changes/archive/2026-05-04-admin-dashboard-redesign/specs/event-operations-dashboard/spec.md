## ADDED Requirements

### Requirement: Live Event Header

The system SHALL display a context-aware header on the dashboard indicating the current active event's name and its operational status (e.g., "LIVE", "PLANNING", "COMPLETED").

#### Scenario: Live Event Display

- **WHEN** an administrator logs into the dashboard during an active event timeframe
- **THEN** the header MUST show the event name (e.g., "Formula 1 Spanish GP") with a "LIVE" status indicator.

### Requirement: Operational Overview Cards

The system SHALL provide real-time metrics for "Active Spectators", "Active Alerts", and "Ticket Claimed Percentage" in a prominent summary section.

#### Scenario: Real-time Metric Updates

- **WHEN** telemetry data or ticket status changes in the database
- **THEN** the dashboard cards MUST reflect the updated values immediately (or via polling/revalidation).

### Requirement: Spectator Inflow Visualization

The dashboard SHALL display a chart representing the volume of spectators entering the venue over time or the density distribution across zones.

#### Scenario: Inflow Chart Rendering

- **WHEN** the dashboard is rendered
- **THEN** it SHALL display a bar chart showing the number of unique telemetry logs or ticket scans per hour.

### Requirement: Gate Congestion Status

The dashboard SHALL include a table listing all active venue gates with their current crowd level (Low, Moderate, High, Blocked) and estimated wait times.

#### Scenario: Gate Status Identification

- **WHEN** a gate reaches a "High" or "Blocked" crowd level
- **THEN** the corresponding row in the table MUST be highlighted with a warning indicator.
