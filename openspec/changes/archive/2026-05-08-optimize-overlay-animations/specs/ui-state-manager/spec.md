## ADDED Requirements

### Requirement: Centralized UI Layer State

The system SHALL maintain a single SharedValue (UI_LAYER) that determines which major UI layer is active (0: Map, 1: Explore, 2: Search, 3: Profile, 4: BusinessDetail).

#### Scenario: Switching Layers

- **WHEN** the user opens the Profile
- **THEN** UI_LAYER MUST update to 3 (Profile) on the UI thread
- **THEN** other layers (Search, Explore) MUST automatically hide based on this value

### Requirement: Automatic Level Collapsing

The system SHALL collapse the Main Dropdown (Top Island) to Level 1 whenever a bottom sheet (Profile, Business Detail) is active.

#### Scenario: Opening Event Details

- **WHEN** UI_LAYER changes to 4 (BusinessDetail)
- **THEN** Main Dropdown level MUST transition to Level 1 automatically
- **THEN** transition MUST happen on the UI thread without React re-renders
