## ADDED Requirements

### Requirement: Elimination of Local Color Primitives
The mobile application SHALL NOT contain local copies of the design tokens defined in the `@app/theme` package.

#### Scenario: Removal of local colors.ts
- **WHEN** the migration is complete
- **THEN** the file `apps/mobile/src/styles/colors.ts` MUST NOT exist.

### Requirement: Consistent Token Application
All UI components MUST use the `useLatticeTheme` hook or direct `@app/theme` imports for styling, ensuring adherence to the centralized design system.

#### Scenario: ThemeGradient Consumption
- **WHEN** `ThemeGradient` is rendered
- **THEN** it MUST use tokens from the shared theme (e.g., `theme.colors.bg.surface`) instead of hardcoded or local values.
