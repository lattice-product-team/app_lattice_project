## ADDED Requirements

### Requirement: Real-time Invalidation Broadcast

The API Server SHALL broadcast a lightweight invalidation signal to all connected Socket.io clients whenever an Event or Point of Interest (POI) is created, updated, or deleted.

#### Scenario: POI Creation Signal

- **WHEN** an admin creates a new POI via the Admin Web API
- **THEN** the server MUST emit a `sync:pois` event via Socket.io containing the operation type (`created`) and the affected POI ID.

#### Scenario: Event Modification Signal

- **WHEN** an event's spatial boundary is updated in the database
- **THEN** the server MUST emit a `sync:event:spatial` event via Socket.io to notify clients of the change.

### Requirement: Reactive Client Cache Invalidation

The Mobile Application SHALL listen for synchronization signals and trigger a background refresh of the relevant data using the state management library (TanStack Query).

#### Scenario: Automatic Map Update

- **WHEN** the mobile app receives a `sync:pois` signal
- **THEN** it MUST invalidate the `pois` query cache, causing the MapLibre components to re-fetch and render the latest data without a manual refresh.
