## ADDED Requirements

### Requirement: Profile Identity Display

The system SHALL display the user's personal identity information in a hero section at the top of the profile screen. This information MUST include a circular avatar, the user's full name, and a short biography.

#### Scenario: Rendering identity with theme tokens

- **WHEN** the profile screen is loaded
- **THEN** the name is displayed using `text.primary` and the bio using `text.secondary` from the active theme.

### Requirement: Functional Utility Grid

The system SHALL provide a grid or row of interactive cards for rapid access to core management features: "My Tickets", "Saved Events", and "Lattice Wallet".

#### Scenario: Interacting with Tickets card

- **WHEN** the user taps on the "My Tickets" card
- **THEN** the system navigates to the tickets feature or displays an empty state if no tickets exist.

### Requirement: Visual Achievement System

The system SHALL feature a "Medals" section that visually represents user milestones and event attendance achievements.

#### Scenario: Displaying achievements

- **WHEN** the user has earned at least one medal
- **THEN** the medal is displayed in a horizontal scrollable row with a high-fidelity icon and its name.

### Requirement: Theme-Aware Rendering

The system SHALL automatically update all UI elements (backgrounds, text, borders, glass effects) when the system theme changes between Light and Dark modes.

#### Scenario: Switching to Dark Mode

- **WHEN** the system theme switches to Dark
- **THEN** the profile background updates to `bg.main` (dark variant) and card backgrounds use `glass.background` with a dark tint.

### Requirement: Grouped Settings List

The system SHALL provide an iOS-style grouped list for auxiliary actions including Account Settings, Privacy, and Logout.

#### Scenario: Accessing Account Settings

- **WHEN** the user taps on "Account" in the settings list
- **THEN** the system triggers the navigation or action associated with account management.
