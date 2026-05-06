# global-ops-center Specification

## Purpose
This spec defines the centralized Operations Center for real-time monitoring of events and venues.

## Requirements

### Requirement: Global Operations Dashboard
The system SHALL provide a centralized "Operations Center" as the root page of the Admin Web application, displaying real-time metrics across all managed venues and events.

#### Scenario: Aggregated Metrics Visualization
- **WHEN** the user visits the root path `/`
- **THEN** the system MUST display the total count of Active Events, Live Users, and High-Priority Incident Alerts.

### Requirement: Multi-Event Monitoring
The dashboard SHALL allow users to view a summary list of all current and upcoming events, independent of a specific venue selection.

#### Scenario: Global Event List
- **WHEN** the Operations Center is loaded
- **THEN** it SHALL display a list of events sorted by `startDate`, including their current status (Live, Upcoming, Planning).
