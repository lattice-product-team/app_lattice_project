## ADDED Requirements

### Requirement: POI Mini-Card Transition

The system SHALL display a compact details card when an individual sub-POI is selected.

#### Scenario: Selection Transition

- **WHEN** a sub-POI is selected
- **THEN** the system SHALL slide down the main Event Sheet and slide up a smaller (max 30% screen height) mini-card with POI details

#### Scenario: Back to Event

- **WHEN** the mini-card is dismissed or the user clicks on the map background
- **THEN** the system SHALL restore the main Event Sheet if the event is still active
