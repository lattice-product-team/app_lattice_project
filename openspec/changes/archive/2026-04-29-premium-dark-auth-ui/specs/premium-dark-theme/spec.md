## ADDED Requirements

### Requirement: High-Contrast Auth Theme
The authentication flow MUST use a dark background configuration to ensure the "Solar Gold" brand color achieves a contrast ratio of at least 4.5:1.

#### Scenario: Welcome screen contrast
- **WHEN** the user opens the app for the first time
- **THEN** the background SHALL be a dark gradient (Midnight)
- **AND** the primary action button SHALL be Solar Gold with black text for maximum readability.

### Requirement: Glassmorphism Legibility
Secondary actions SHALL use a glassmorphism effect (native blur) with a subtle border to remain distinct from the dark background.

#### Scenario: Secondary action visibility
- **WHEN** a secondary action (e.g., "JA TINC COMPTE") is displayed
- **THEN** it SHALL have a semi-transparent blurred background
- **AND** a 1px border with 10% white opacity.

### Requirement: Unified Auth Experience
All screens within the `(auth)` route group MUST share the same "Midnight" theme configuration for visual continuity.

#### Scenario: Navigation within auth
- **WHEN** navigating from Welcome to Login
- **THEN** the background theme SHALL remain consistent without flickering or changing to light mode.
