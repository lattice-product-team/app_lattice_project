## ADDED Requirements

### Requirement: Centralized Semantic Color System
The mobile application SHALL utilize a centralized semantic color system where components reference theme tokens (e.g., `theme.colors.brand.primary`) rather than hardcoded hex values or raw primitives.

#### Scenario: Component styling uses theme tokens
- **WHEN** a developer creates or modifies a UI component
- **THEN** they MUST use the `useTheme` hook or equivalent to access standard tokens
- **AND** they MUST NOT use literal strings like '#FFFFFF' or 'white' for styling

### Requirement: Professional UX Color Rationale
All color assignments SHALL follow a professional UX/UI rationale, ensuring accessibility (WCAG AA contrast ratios), visual hierarchy, and brand alignment with the "Midnight Glass" aesthetic.

#### Scenario: Dark mode background adherence
- **WHEN** the system appearance is set to dark
- **THEN** the main background color MUST resolve to the defined `midnight.base` primitive
- **AND** elevated surfaces MUST use the appropriate elevation tokens to provide depth

### Requirement: Deprecation of Hardcoded Colors
All existing hardcoded colors in the `apps/mobile` directory SHALL be identified and replaced with the appropriate semantic tokens.

#### Scenario: Linting or manual audit identifies hardcoded colors
- **WHEN** an audit of the codebase is performed
- **THEN** no hex values, rgba strings, or color keywords (except in primitive definitions) SHOULD be found in component styles
