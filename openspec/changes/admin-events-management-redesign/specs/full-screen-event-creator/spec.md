## ADDED Requirements

### Requirement: Full-Screen Event Interface

The event creation and editing interface SHALL occupy the entire viewport, providing an immersive, focused operational environment.

#### Scenario: Opening the Event Creator

- **WHEN** the "Create New Event" button is clicked
- **THEN** a full-screen overlay SHALL open, covering the entire dashboard.

### Requirement: Industrial Aesthetic Standards

The full-screen interface SHALL use sharp corners (no border-radius) and the "Waldenburg" typography to maintain an industrial, editorial aesthetic.

#### Scenario: Visual Verification

- **WHEN** the full-screen interface is rendered
- **THEN** it MUST NOT have rounded corners and MUST use the Waldenburg font family for primary headings.

### Requirement: Explicit Dismissal Action

The full-screen interface SHALL provide a prominent and consistent close action in the top-right corner.

#### Scenario: Closing the Interface

- **WHEN** the "X" button in the top-right corner is clicked
- **THEN** the interface SHALL close, returning the administrator to the event list.

### Requirement: Dual-Column Layout

The interface SHALL feature a dual-column layout where the boundary editor (map) and event configuration (form) are displayed side-by-side or stacked to maximize space.

#### Scenario: Map and Form Display

- **WHEN** the interface is open
- **THEN** both the interactive boundary map and the configuration fields SHALL be accessible without excessive scrolling.
