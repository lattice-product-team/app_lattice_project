## ADDED Requirements

### Requirement: Heatmap Visualization
The system SHALL visualize user density as a heatmap layer on the global map.
- The heatmap MUST use a gradient from transparent (low density) through Signal Blue to Ember (high density).
- The heatmap SHALL update every 5 seconds to reflect live telemetry.

#### Scenario: Visualizing crowd density
- **WHEN** telemetry data is received for an event
- **THEN** a heatmap layer is rendered on the map over the event's boundary.

### Requirement: Per-Event Radar Toggle
The system SHALL provide a toggle for each event to activate/deactivate its crowd radar visualization.
- Toggles MUST be accessible from the "Active Layers" panel.
- Activating a toggle SHALL initiate telemetry polling for that event.

#### Scenario: Toggling radar for an event
- **WHEN** user clicks the radar icon next to "Event A"
- **THEN** the heatmap for "Event A" is displayed on the map.
