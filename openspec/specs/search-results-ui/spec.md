## ADDED Requirements

### Requirement: Level 3 Search View
The system SHALL replace the Discovery Dashboard with a Search Experience view when searching is active in Level 3.

#### Scenario: Entering search mode
- **WHEN** the user focuses the search bar while the island is in Level 3
- **THEN** the UI displays the "Recent Searches" and "Available Events" sections

### Requirement: Search Filtering
The system SHALL filter the list of available events in real-time as the user types.

#### Scenario: Typing a search query
- **WHEN** the user types "Jazz"
- **THEN** only events with "Jazz" in their name or description are displayed

### Requirement: Search Item Interaction
The system SHALL navigate to the event location on the map when a search result is tapped.

#### Scenario: Selecting an event from search
- **WHEN** the user taps on an event result "Lattice Festival"
- **THEN** the island collapses to Level 2 and the map centers on the event coordinates
