## ADDED Requirements

### Requirement: Real-time Data Reconciliation

The administrative frontend SHALL listen for real-time update events and merge them into the existing data state.

#### Scenario: Table Update on Remote Change

- **WHEN** a `admin:pois:updated` event is received
- **THEN** the administrative table SHALL update the corresponding row without a full page reload.
