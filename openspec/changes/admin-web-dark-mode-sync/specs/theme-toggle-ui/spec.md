## ADDED Requirements

### Requirement: Theme Toggle Interface

The application SHALL provide a manual theme toggle in the footer of the Control Panel (Sidebar).

#### Scenario: User toggles theme manually

- **WHEN** the user clicks the theme switch in the Control Panel
- **THEN** the application MUST transition between light and dark themes
- **AND** the icons MUST animate to reflect the new state (Sun for Light, Moon for Dark)

### Requirement: Switch Positioning

The theme switch SHALL be positioned at the bottom-left corner of the Sidebar component.

#### Scenario: Sidebar is open

- **WHEN** the Sidebar is open
- **THEN** the theme switch MUST be visible at the bottom of the content area
