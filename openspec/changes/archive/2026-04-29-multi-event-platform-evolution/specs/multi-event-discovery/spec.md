## ADDED Requirements

### Requirement: Event Selection Lifecycle

The system must allow users to browse available events and enter a selected event context.

#### Scenario: Entering an Event Context

- **WHEN** a user selects an event from the Discovery carousel
- **THEN** the application state must update `currentEventId`, fetch event-specific POIs, and center the map on the event's location.

#### Scenario: Category Theme Customization

- **WHEN** an event is active
- **THEN** the UI must apply color accents corresponding to the event's category (Music=Purple, Tech=Blue, Food=Orange, Sports=Red).

### Requirement: Remote Awareness

The system must distinguish between users physically at the event and those exploring remotely.

#### Scenario: Navigation Warning for Remote Users

- **WHEN** a user attempts to start navigation to a POI while physically more than 2km from the event boundary
- **THEN** the system must display a warning card stating that live navigation is disabled in remote mode.
