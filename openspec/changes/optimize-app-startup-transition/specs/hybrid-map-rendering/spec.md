## ADDED Requirements

### Requirement: Background Initialization Support
The map system SHALL support a "Hidden Start" mode where it initializes all native layers and loading style events while hidden behind an overlay.

#### Scenario: Startup rendering
- **WHEN** the map is mounted during the startup sequence
- **THEN** it MUST emit the `onDidFinishLoadingStyle` event reliably even if it is not the top-most visible layer in the UI stack.
