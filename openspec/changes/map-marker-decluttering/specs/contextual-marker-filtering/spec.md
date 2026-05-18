## ADDED Requirements

### Requirement: Zoom-Based Label Visibility

The system SHALL hide text labels for POIs at lower zoom levels to prevent visual clutter, only showing the pin icon.

#### Scenario: Hiding labels at low zoom

- **WHEN** the map zoom level is less than 17
- **THEN** POI markers SHALL hide their `labelBadge` component
- **AND** only the `MapPinFrame` with the icon SHALL be visible.

### Requirement: Selection-Priority Rendering

The system SHALL ensure that child POIs of a selected Event remain visible even at zoom levels where they would otherwise be hidden.

#### Scenario: Forcing visibility on selection

- **WHEN** an Event is selected
- **THEN** all POIs linked to that Event ID MUST be rendered regardless of the current zoom level
- **AND** their labels SHALL be displayed.
