## ADDED Requirements

### Requirement: HeroUI v3 Framework Integration

The Admin Web application SHALL use HeroUI v3 as its primary component framework. All new and refactored UI elements MUST utilize HeroUI components (e.g., `<Button>`, `<Card>`, `<Navbar>`).

#### Scenario: Component Usage

- **WHEN** a developer adds a new action button to the Admin panel
- **THEN** it MUST be implemented using the HeroUI `<Button>` component.

### Requirement: Semantic Token Mapping (OKLCH)

The system SHALL map `@app/theme` color tokens to HeroUI's semantic CSS variables using the OKLCH color space to ensure consistency and modern browser performance.

#### Scenario: Primary Color Mapping

- **WHEN** the `admin-web` application loads
- **THEN** the `--accent` CSS variable MUST be set to the OKLCH equivalent of the "Solar Gold" primary color.

### Requirement: Standardized Sidebar Navigation

The Admin Web layout SHALL implement a standardized, responsive sidebar using HeroUI navigation components, replacing the manual Tailwind-based aside.

#### Scenario: Navigation Interaction

- **WHEN** a user navigates between "Venues" and "Events"
- **THEN** the active state MUST be indicated using HeroUI's built-in semantic styling.

### Requirement: Inter Typeface Enforcement

The Admin Web application SHALL use **Inter** as the mandatory typeface for all interface text, as defined in the global design tokens.

#### Scenario: Font Application

- **WHEN** the application is rendered
- **THEN** the computed `font-family` for the `<body>` element MUST prioritize "Inter".
