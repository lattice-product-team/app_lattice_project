## ADDED Requirements

### Requirement: HUD Separation Pattern
The map application SHALL strictly separate the Map rendering lifecycle from the overlay UI lifecycle (HUD) to prevent UI state changes from triggering map re-renders.

#### Scenario: Searching does not lag map pan
- **WHEN** the user is panning the map and simultaneously typing in the search bar
- **THEN** the map pan animation SHALL maintain 60fps and not suffer from JS bridge saturation.

### Requirement: Atomic State Selection
POI selection state SHALL be managed through atomic selectors to ensure only the components specifically interested in the selected POI update.

#### Scenario: Selecting a POI updates carousel only
- **WHEN** a POI is selected on the map
- **THEN** only the `POICarousel` and `MapSheet` components SHALL re-render, and the `MapView` SHALL only receive a filter update.
