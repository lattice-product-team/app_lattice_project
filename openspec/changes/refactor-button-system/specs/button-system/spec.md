## ADDED Requirements

### Requirement: Standardized Button Component
The system SHALL provide a single, highly configurable `Button` component that replaces all legacy `PremiumButton` instances.

#### Scenario: Basic Button Rendering
- **WHEN** a `Button` is rendered with a label "Action"
- **THEN** it MUST display the text clearly and be interactive.

### Requirement: Four Visual Variants
The `Button` component SHALL support four distinct visual variants: `primary`, `subdued`, `tertiary`, and `ghost`.
- **Primary**: Solid brand color background, inverse text.
- **Subdued**: Translucent brand color background, brand color text.
- **Tertiary**: Surface-colored background, primary text.
- **Ghost**: Transparent background, brand color text.

#### Scenario: Variant Selection
- **WHEN** the `variant` prop is set to `subdued`
- **THEN** the button MUST use a translucent version of the brand color for its background.

### Requirement: Dark and Light Mode Support
The `Button` component SHALL automatically adapt its colors based on the current system theme (Light/Dark), providing 8 distinct visual states (4 variants per theme).

#### Scenario: Theme Adaptation
- **WHEN** the system theme changes from Light to Dark
- **THEN** all 4 variants MUST transition to their respective dark mode color tokens (e.g. `tertiary` transitioning from light gray to dark elevation color).

### Requirement: Interactive States and Feedback
The `Button` component SHALL provide visual and haptic feedback during interactions.

#### Scenario: Press Animation
- **WHEN** a user presses the button
- **THEN** it MUST scale down slightly and trigger a light haptic pulse.

### Requirement: Icon Support
The `Button` component SHALL support optional icons on the left or right of the label.

#### Scenario: Button with Arrow
- **WHEN** a `rightIcon` is provided
- **THEN** it MUST be rendered to the right of the text label.
