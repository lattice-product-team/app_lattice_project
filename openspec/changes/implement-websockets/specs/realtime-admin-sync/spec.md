## ADDED Requirements

### Requirement: Real-time Admin Notifications

The system SHALL broadcast lightweight administrative update notifications (IDs only) to connected admin clients.

#### Scenario: New Event Notification

- **WHEN** a new event is created in the system
- **THEN** all connected admin clients SHALL receive an `admin:events:new` event with the `id` of the new event.

### Requirement: Restricted Admin Channels

The system SHALL implement restricted "rooms" to ensure data privacy.

#### Scenario: Authorized Room Join

- **WHEN** an authenticated admin attempts to join the `admin` room
- **THEN** the server SHALL verify their `admin` role before allowing them to join.
