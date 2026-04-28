## MODIFIED Requirements

### Requirement: Design System Alignment (NativeWind)
The mobile application components SHALL use NativeWind (Tailwind) classes for styling and Design System tokens for colors and spacing. These tokens MUST be sourced from the centralized `@app/theme` package to ensure brand alignment.

#### Scenario: Style Migration
- **WHEN** the `MapContent` component is styled
- **THEN** it MUST use `className` with Tailwind classes instead of `StyleSheet.create`
