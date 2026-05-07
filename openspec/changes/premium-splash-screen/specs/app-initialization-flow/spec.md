## ADDED Requirements

### Requirement: Premium Splash Screen Presentation

The system SHALL display a premium animated splash screen upon application launch. This screen MUST feature a vibrant gradient background and a glassmorphism card containing the Lattice logo.

#### Scenario: Display on launch

- **WHEN** the application starts from a cold state
- **THEN** the system displays the premium splash screen with entrance animations

### Requirement: Initialization Task Synchronization

The system SHALL remain on the splash screen until all critical initialization tasks are complete, including font loading, authentication state verification, and initial data pre-fetching.

#### Scenario: Completion of tasks

- **WHEN** all startup tasks are complete and a minimum display time of 2 seconds has elapsed
- **THEN** the system triggers the exit animation of the splash screen

### Requirement: Exit Animation Transition

The system SHALL perform a smooth transition from the splash screen to the target route (Main Map or Onboarding). This transition MUST involve a fade or scale effect that reveals the destination UI.

#### Scenario: Transition to Map

- **WHEN** the splash screen exit is triggered and the user is authenticated
- **THEN** the splash screen fades out to reveal the main map interface

### Requirement: Fallback Presentation

The system SHALL provide a high-quality fallback (solid color or basic gradient) for the splash screen if Skia native modules are unavailable or fail to load.

#### Scenario: Skia failure

- **WHEN** Skia fails to initialize during startup
- **THEN** the system renders the splash screen using standard React Native views while maintaining the brand colors
