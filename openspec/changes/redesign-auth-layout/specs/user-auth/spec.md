## ADDED Requirements

### Requirement: Social-First Visual Hierarchy
The system SHALL display Apple and Google authentication buttons at the primary visual level (top of the interaction area) to encourage frictionless access.

#### Scenario: User opens login screen
- **WHEN** the user navigates to the Login or Register screen
- **THEN** the system SHALL display "Continue with Google" and "Continue with Apple" as the most prominent actions

### Requirement: Progressive Email Disclosure
The system SHALL hide the Email/Password form fields by default, revealing them only when the user explicitly chooses the email method.

#### Scenario: User chooses to use email
- **WHEN** the user clicks the "Connect with Email" button
- **THEN** the system SHALL animate the expansion of the Email and Password input fields
- **AND** SHALL focus the Email input field automatically

### Requirement: Official Branding Compliance
The system SHALL use official colors and iconography for Google and Apple buttons to maintain platform trust and recognition.

#### Scenario: Rendering social buttons
- **WHEN** the "Continue with Google" button is rendered
- **THEN** it SHALL use the official Google multicolor 'G' and white background
- **WHEN** the "Continue with Apple" button is rendered
- **THEN** it SHALL use the official Apple logo on a black or white background (depending on theme)

### Requirement: Legal and Consent Footer
The system SHALL display links to the Terms of Service and Privacy Policy at the bottom of the authentication interface.

#### Scenario: User views auth footer
- **WHEN** the user is on any authentication screen
- **THEN** the system SHALL display a footer with "By continuing, you agree to our Terms of Service and Privacy Policy"
- **AND** the links SHALL be tappable and open the respective documents
