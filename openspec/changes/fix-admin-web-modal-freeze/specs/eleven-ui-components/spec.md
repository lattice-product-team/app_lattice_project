## ADDED Requirements

### Requirement: Standardized HeroUI Component usage
The system SHALL strictly adhere to the official HeroUI v3.x component APIs and naming conventions to prevent runtime errors and ensure consistent behavior.

#### Scenario: Using Modal Components
- **WHEN** implementing a modal interface
- **THEN** the system MUST use `ModalContent` as the direct wrapper for modal headers, bodies, and footers.
