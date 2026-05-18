## MODIFIED Requirements

### Requirement: Dynamic Mobile Synchronization

The mobile application SHALL dynamically fetch and render the event boundary and POIs defined in the Admin Web. This synchronization MUST be reactive, updating the view in real-time when the underlying data changes on the server.

#### Scenario: Mobile Reflection of Web Changes

- **WHEN** a mobile user views an event map and a change is persisted on the server
- **THEN** the app SHALL automatically reflect the exact boundary and POIs that were persisted from the Admin Web without requiring the user to re-open the map or pull-to-refresh.
