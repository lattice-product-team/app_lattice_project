## ADDED Requirements

### Requirement: Eleven Dashboard Layout

The Admin Dashboard SHALL implement a grid-based layout using the Eleven style, featuring a large editorial header and floating cards on an Eggshell ground.

#### Scenario: Dashboard Visual Audit

- **WHEN** the dashboard is rendered
- **THEN** the main background MUST be Eggshell (#fdfcfc) and the primary headline MUST use Waldenburg 300 typography.

### Requirement: Operational Metric Cards

Operational metrics on the dashboard SHALL be rendered using "Floating Product Demo Cards" with 16px border-radius and hairline shadows to distinguish them from the page ground.

#### Scenario: Metric Card Elevation

- **WHEN** a metric card (e.g., Live Users) is displayed
- **THEN** it MUST use the `shadow-hairline` (1px solid-like shadow) and a background of #ffffff.
