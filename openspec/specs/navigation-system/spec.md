## ADDED Requirements

### Requirement: Routing Service (Valhalla)

The system SHALL provide routing capabilities for "driving" and "pedestrian" profiles using the Valhalla engine integrated in the Docker infrastructure.

- **Region**: Barcelona (OSM data).
- **Format**: Routes MUST be returned as GeoJSON LineString for MapLibre rendering.

#### Scenario: Requesting a walking route

- **WHEN** user selects a destination and chooses the "Walking" profile
- **THEN** system fetches the shortest pedestrian path from Valhalla and renders it on the map.

### Requirement: Active Navigation UI

The system SHALL provide an immersive UI mode for active navigation.

- **Instruction Banner**: Top-mounted dark glassmorphism banner with turn-by-turn instructions in **English**.
- **Arrival Summary**: Bottom-mounted white glassmorphism sheet with Arrival Time, Duration (min), and Distance (km).

#### Scenario: Starting active navigation

- **WHEN** user taps "Go" on a selected route
- **THEN** system activates the instruction banner and centers the camera on the user's location.

### Requirement: Navigation Camera Behavior

During active navigation, the map camera SHALL automatically follow the user's location.

- **Mode**: "Course" tracking (map rotates based on user heading).
- **Pitch**: 45 degrees for a 3D perspective view.

### Requirement: Static Route Persistence

The system SHALL NOT automatically recalculate the route if the user deviates from the path (Phase 1).

- **Behavior**: The original route line remains fixed until the user manually restarts or cancels navigation.

### Requirement: 2D Navigation Puck

The system SHALL represent the user's location using a directional 2D arrow icon during active navigation.

- **Visuals**: A clean, high-contrast arrow pointing in the direction of travel.
