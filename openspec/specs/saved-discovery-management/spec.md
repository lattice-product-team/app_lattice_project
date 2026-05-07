## ADDED Requirements

### Requirement: Bottom-Sheet Integrated Saved Center

The system SHALL replace the legacy full-screen Saved Locations Modal with a dedicated state within the `MapBottomSheet`, allowing users to manage saved items without losing map context.

#### Scenario: Accessing saved items

- **WHEN** the user interacts with the "Saved" or "Library" section in the main sheet
- **THEN** the sheet content MUST transition to show a list of saved events and venues.

### Requirement: Entity-Based Saving

The system SHALL support saving high-level entities (Events and Venues) rather than just raw geographic coordinates.

#### Scenario: Saving an event

- **WHEN** the user clicks "Save" on an event detail view
- **THEN** the system MUST store the event ID and metadata, ensuring it appears in the "Saved" list with its category and date.

### Requirement: Saved Item Quick Navigation

The system SHALL provide immediate navigation actions for all items in the saved list.

#### Scenario: Quick route from saved list

- **WHEN** viewing the saved events list
- **THEN** each item MUST expose a quick "Navigate" action that calculates the route to the event venue.
