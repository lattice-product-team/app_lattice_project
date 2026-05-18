## ADDED Requirements

### Requirement: Premium Visual Header

The Detail Sheet SHALL implement a high-fidelity header featuring:

1. A solid dark navy background (`#0B1B32`) sampled from the reference designs.
2. A subtle linear gradient to transparent to ensure depth.
3. A centered brand logo or category icon floating above the background.
4. Large, bold title and subtitle text aligned below the logo.

#### Scenario: Rendering the header

- **WHEN** the sheet is in Level 2 or Level 3
- **THEN** it MUST display the dark navy background
- **AND** render the brand logo and title with high contrast.

### Requirement: Metric Grid Layout

The Detail Sheet SHALL display a row of key metrics (Hours, Ratings, Accepts, Distance) below the action pills.

#### Scenario: Metric alignment

- **WHEN** multiple metrics are available
- **THEN** they MUST be displayed in a horizontal grid with centered icons and labels
- **AND** use specific colors for state (e.g., Green for "Open").

### Requirement: Action Pill Bar

The Detail Sheet SHALL display a horizontal, scrollable bar of action "pills" for primary interactions (Directions, Offline, Website, Tickets).

#### Scenario: Interacting with pills

- **WHEN** a user taps a pill
- **THEN** it SHALL trigger the corresponding action (e.g., opening the navigation planner)
- **AND** provide haptic feedback.
