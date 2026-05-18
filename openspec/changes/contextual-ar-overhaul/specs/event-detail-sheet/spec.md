## ADDED Requirements

### Requirement: Contextual AR Access Control

The "Use AR" action in the detail sheet SHALL be conditionally available based on the user's proximity to the event boundary.

#### Scenario: AR available within boundary

- **WHEN** the user is inside the boundary of the selected event
- **THEN** the "Use AR" action MUST be enabled.

#### Scenario: AR unavailable outside boundary

- **WHEN** the user is outside the boundary of the selected event
- **THEN** the "Use AR" action SHOULD be disabled or hidden to prevent out-of-context AR exploration.
