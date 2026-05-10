## MODIFIED Requirements

### Requirement: Real-time Admin Notifications
The system SHALL broadcast lightweight administrative update notifications (IDs only) to connected admin clients. Before broadcasting, the system SHALL ensure any relevant cached data is invalidated.

#### Scenario: New Event Notification with Invalidation
- **WHEN** a new event is created in the system
- **THEN** the system SHALL first invalidate the relevant Redis cache keys AND THEN broadcast an `admin:events:new` event with the `id` of the new event.
