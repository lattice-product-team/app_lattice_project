## ADDED Requirements

### Requirement: Startup Time Monitoring
The system SHALL log the total time from the execution of the `RootLayout` until the `isInitialLoadComplete` state is reached.

#### Scenario: Performance Metric Generation
- **WHEN** the application completes its initial loading sequence
- **THEN** a log entry MUST be generated containing the total boot time in milliseconds.

### Requirement: Predictive Map Loading
The system MUST begin fetching map-related data (POIs and Events) and loading map style assets as soon as the application reaches the `RootLayout` or `Index` component, prior to the Map component mounting.

#### Scenario: Background Data Warming
- **WHEN** the user is viewing the Splash or Auth screen
- **THEN** the system SHALL launch background queries to populate the React Query cache for POIs and Events.
