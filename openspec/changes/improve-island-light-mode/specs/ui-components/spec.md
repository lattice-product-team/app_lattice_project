## ADDED Requirements

### Requirement: Theme-Aware Glass Components
All components utilizing a glassmorphism effect (blur + translucency) SHALL dynamically adjust their tint and opacity based on the active system theme to ensure legibility.

#### Scenario: Light Mode Glass Appearance
- **WHEN** the system theme is set to 'light'
- **THEN** glass components MUST use a 'light' tint and ensure background opacity allows for high-contrast text overlay.

#### Scenario: Dark Mode Glass Appearance
- **WHEN** the system theme is set to 'dark'
- **THEN** glass components MUST use a 'dark' tint.

### Requirement: Semantic Token Enforcement
UI components SHALL NOT use hardcoded hex or RGBA values for colors. They MUST exclusively use tokens from the `LatticeTheme`.

#### Scenario: Token Verification
- **WHEN** a component style is inspected
- **THEN** it MUST reference a theme property (e.g., `theme.colors.text.primary`) rather than a literal color value.
