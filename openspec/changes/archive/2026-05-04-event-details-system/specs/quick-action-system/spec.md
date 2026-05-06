## ADDED Requirements

### Requirement: Standardized Action Row
The Event Detail Sheet SHALL include a row of quick actions containing "Directions", "Call", and "Website" buttons.

#### Scenario: Visual distribution
- **WHEN** the detail sheet is opened at Level 2
- **THEN** the action buttons MUST be distributed symmetrically with equal spacing

### Requirement: Themed Button States
Quick action buttons SHALL use the brand primary color for the active state and a glass-morphic style for the background.

#### Scenario: Interactive feedback
- **WHEN** a user presses a quick action button
- **THEN** it MUST provide haptic feedback and a visual scale/opacity change

### Requirement: Symmetrical Header
The detail sheet header SHALL contain a drag handle in the center, a "Share" icon on the far left, and a "Close (X)" icon on the far right.

#### Scenario: Dismissing the sheet
- **WHEN** the user taps the "Close (X)" icon
- **THEN** the Event Detail Sheet SHALL animate back to Nivel 0 and be removed from the view stack
