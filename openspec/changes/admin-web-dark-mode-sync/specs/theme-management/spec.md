## ADDED Requirements

### Requirement: System Theme Synchronization
The admin-web application SHALL automatically detect and apply the user's system theme preference (Light or Dark) on initial load and when the system setting changes.

#### Scenario: Application loads with dark system preference
- **WHEN** the user opens the application and their system is set to dark mode
- **THEN** the application MUST render with the dark theme active
- **AND** the `<html>` element MUST have the `dark` class applied

#### Scenario: Application loads with light system preference
- **WHEN** the user opens the application and their system is set to light mode
- **THEN** the application MUST render with the light theme active
- **AND** the `<html>` element MUST have the `light` class applied

### Requirement: Theme Persistence
The application SHALL persist the user's theme choice (if manually overridden) across browser sessions.

#### Scenario: User manually switches theme
- **WHEN** the user manually selects a theme different from the system default
- **THEN** the application MUST remember this choice and apply it on subsequent visits
