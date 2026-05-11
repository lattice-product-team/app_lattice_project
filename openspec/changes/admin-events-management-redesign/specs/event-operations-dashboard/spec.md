## MODIFIED Requirements

### Requirement: Event Management Actions
The system SHALL provide "View" and "Manage" actions for each event in the list. "View" SHALL navigate to the real-time monitoring dashboard for that specific event. "Manage" SHALL open the full-screen interface to edit the event's configuration.

#### Scenario: Navigating to Event Dashboard
- **WHEN** the "View" button for an event is clicked
- **THEN** the system SHALL navigate to the dashboard (`/`) and update the context to display that event's live telemetry.

#### Scenario: Editing an Event
- **WHEN** the "Manage" button for an event is clicked
- **THEN** the full-screen interface SHALL open with the event's current data pre-populated.

## REMOVED Requirements

### Requirement: Global Archive Action
The dashboard SHALL provide an "Archive All" button to clear the active schedule.
**Reason**: This action is redundant and poses a risk of accidental data loss in a production environment.
**Migration**: Administrators SHALL archive events individually using the "Manage" interface if needed.
