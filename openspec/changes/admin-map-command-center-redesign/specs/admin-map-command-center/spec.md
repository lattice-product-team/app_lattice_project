## ADDED Requirements

### Requirement: Centralized Event Search
The system SHALL provide a global search bar within the map interface to allow administrators to find and focus on specific events.

#### Scenario: Search and Focus
- **WHEN** an administrator enters an event name in the search bar
- **THEN** the map SHALL fly to the event's location and open its detail panel.

### Requirement: Persistent Native Map Labels
The map interface SHALL display event names as native text labels directly on the map surface to improve spatial orientation.

#### Scenario: Zoom-Dependent Labels
- **WHEN** the map is zoomed to an appropriate level
- **THEN** event names SHALL be visible as text layers without requiring user interaction.

### Requirement: Non-Blocking Sidebar Panel
The system SHALL utilize a collapsible sidebar for event layer management and primary navigation to prevent occlusion of map content.

#### Scenario: Sidebar Toggling
- **WHEN** the administrator toggles the sidebar
- **THEN** it SHALL collapse or expand, dynamically adjusting the map's interactive area to ensure no navigation elements block map interactions.

### Requirement: Integrated Command Dock
The top of the map interface SHALL feature a unified dock for search, system status, and secondary actions (e.g., logout).

#### Scenario: Command Dock Visibility
- **WHEN** the map page is loaded
- **THEN** the command dock SHALL be visible as a semi-transparent, non-obtrusive overlay at the top of the viewport.

### Requirement: Crowd Radar "Scanner" Toggle
The system SHALL provide an intuitive toggle for each event to activate or deactivate the Crowd Radar telemetry heatmap.

#### Scenario: Activating Radar
- **WHEN** the administrator activates the radar for a specific event
- **THEN** the map SHALL render the telemetry heatmap layer for that event's boundary.
