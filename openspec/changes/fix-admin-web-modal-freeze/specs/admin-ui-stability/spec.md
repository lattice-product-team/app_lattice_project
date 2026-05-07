## ADDED Requirements

### Requirement: Modal Interface Stability
The system SHALL ensure that creation modals (Events, POIs) open reliably without causing application crashes or freezing the main thread.

#### Scenario: Opening Event Creation Modal
- **WHEN** the user clicks "Create New Event"
- **THEN** the modal MUST open immediately and display all form fields and the interactive map without locking the browser UI.

### Requirement: Map Initialization Safety
Interactive maps within modals SHALL be loaded dynamically to ensure stable initialization and prevent layout-driven infinite re-render loops.

#### Scenario: Map Rendering in Modal
- **WHEN** a creation modal is opened
- **THEN** the embedded map MUST initialize only after the modal container has established its dimensions.

### Requirement: Interaction Guardrails
State updates triggered by component interactions (e.g., selection changes) SHALL be guarded to prevent redundant re-renders.

#### Scenario: Selecting Event for POI
- **WHEN** the user selects a parent event in the POI registration form
- **THEN** the selection MUST be applied once, and the map boundary MUST update without triggering a UI freeze.
