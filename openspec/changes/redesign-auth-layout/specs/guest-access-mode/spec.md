## ADDED Requirements

### Requirement: Anonymous Exploration

The system SHALL allow users to access the main map interface and basic search functionality without requiring an active session.

#### Scenario: User skips authentication

- **WHEN** the user selects "Skip for now" or "Continue as Guest" on the authentication screen
- **THEN** the system SHALL navigate to the main map interface with limited features

### Requirement: Protected Feature Interception

The system SHALL intercept attempts to access protected features (Profile, Saved Places, Event Creation) and display a contextual authentication prompt.

#### Scenario: Guest attempts to save a place

- **WHEN** an unauthenticated user clicks the "Save" button on a map POI
- **THEN** the system SHALL display a Bottom Sheet prompt inviting the user to Login or Register

### Requirement: Persistent Session Recovery

The system SHALL preserve the user's intent after authentication if they were prompted via a contextual auth sheet.

#### Scenario: Guest logs in after being prompted

- **WHEN** the user completes the Login/Register flow after being prompted by the Auth Sheet
- **THEN** the system SHALL return to the previous state and complete the originally intended action (e.g., Save Place) if possible
