## ADDED Requirements

### Requirement: Event-Aware Brand Overrides
The system SHALL support dynamic overriding of the primary brand color based on the current active event type.

#### Scenario: Switching to Event Color
- **WHEN** an event of type "music" is active
- **THEN** the `brand-primary` token SHALL be overridden by the `category-music` color.

### Requirement: Unified Theme Hook
The mobile application SHALL provide a single `useAppTheme` hook that merges base neutral tokens with current brand overrides.

#### Scenario: Accessing Primary Color
- **WHEN** a component calls `useAppTheme().colors.primary`
- **THEN** it SHALL receive the correct color (either Lattice Gold or Event Brand) without manual logic.
