## ADDED Requirements

### Requirement: User Profile Accessibility Preferences

The system must allow users to define physical constraints that impact navigation routes.

#### Scenario: Persistent Accessibility Settings

- **WHEN** a user updates their preferences in the Profile screen (e.g., "Evitar escaleras")
- **THEN** these settings must be saved to the user's profile and applied to all subsequent route calculations.

### Requirement: Constrained Pathfinding

The routing engine must only include segments that satisfy the user's active constraints.

#### Scenario: Wheelchair Accessible Route

- **WHEN** "Ruta accesible para silla de ruedas" is enabled
- **THEN** the pathfinding algorithm must exclude all path segments where `isWheelchairAccessible` is false or `hasStairs` is true.
