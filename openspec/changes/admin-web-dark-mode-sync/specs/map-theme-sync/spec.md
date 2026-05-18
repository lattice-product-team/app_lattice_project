## ADDED Requirements

### Requirement: Dynamic Map Style Switching

The `AdminMap` component SHALL synchronize its visual style with the active application theme.

#### Scenario: Active theme is dark

- **WHEN** the application theme is set to dark
- **THEN** the `AdminMap` MUST use the `streets-v2-dark` MapTiler style URL

#### Scenario: Active theme is light

- **WHEN** the application theme is set to light
- **THEN** the `AdminMap` MUST use the `streets-v2` MapTiler style URL

### Requirement: Visual Cohesion in Dark Mode

The geographic layers (boundaries, markers, labels) SHALL remain clearly visible and accessible when the dark map style is active.

#### Scenario: Boundary visibility in dark mode

- **WHEN** the dark map style is active
- **THEN** the boundary fill and line colors MUST maintain sufficient contrast against the dark base map
