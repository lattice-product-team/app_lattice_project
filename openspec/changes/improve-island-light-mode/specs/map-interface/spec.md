## ADDED Requirements

### Requirement: HUD and Island Legibility
The map interface elements (including the growing island and control HUD) SHALL maintain high visibility and contrast across all map regions in both light and dark modes.

#### Scenario: Light Mode HUD Visibility
- **WHEN** the system theme is 'light'
- **THEN** HUD icons and text MUST use `theme.colors.text.primary` or `theme.colors.text.secondary` which provide at least 4.5:1 contrast against the light glass background.

### Requirement: Dynamic Blur Tinting
The `SafeBlurView` components used in the map interface SHALL automatically synchronize their `tint` property with the current theme.

#### Scenario: Automatic Tint Sync
- **WHEN** the system theme toggles between 'light' and 'dark'
- **THEN** the `SafeBlurView` components MUST update their `tint` to match `theme.colors.glass.tint`.
