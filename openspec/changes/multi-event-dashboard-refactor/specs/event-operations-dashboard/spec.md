## MODIFIED Requirements

### Requirement: Live Event Header

The system SHALL display a context-aware header on the dashboard indicating the current active event's name and its operational status (e.g., "LIVE", "PLANNING", "COMPLETED").

#### Scenario: Live Event Display

- **WHEN** an event is selected in the dashboard
- **THEN** the header MUST dynamically show the selected event name and its status badge.

### Requirement: Operational Overview Cards

The system SHALL provide real-time metrics for "Active Spectators", "Active Alerts", and "Ticket Claimed Percentage" in a prominent summary section.

#### Scenario: Real-time Metric Updates

- **WHEN** the active event context changes
- **THEN** the dashboard cards MUST refresh and reflect the specific telemetry and ticket data for the selected event.

## ADDED Requirements

### Requirement: General Access Point Status

The system SHALL display an "Access Point Status" table (formerly Gate Status) that adapts its labeling to the event type (e.g., "Gates" for sports, "Check-ins" for conferences).

#### Scenario: Adapting to Event Type

- **WHEN** a "Conference" type event is selected
- **THEN** the status table MUST use terminology appropriate for high-density indoor gatherings.
