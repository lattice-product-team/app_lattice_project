## MODIFIED Requirements

### Requirement: Responsive Corner Radius
The Event Detail Sheet SHALL adapt its corner radius based on its vertical position: 32px (all corners) at Level 2 (floating) and 0px (bottom corners) at Level 3 (expanded). To ensure visual consistency with the "Modern Solid" aesthetic, the sheet background SHALL use a high-opacity solid color (0.9 opacity) instead of translucent blur.

#### Scenario: Expanding to full screen
- **WHEN** the user drags the Detail Sheet from Level 2 to Level 3
- **THEN** the bottom corner radius MUST animate from 32px to 0px
- **AND** the background MUST maintain a solid appearance without real-time blur calculations

## ADDED Requirements

### Requirement: Modern Solid Aesthetic
The detail sheet system SHALL utilize a calibrated solid-transparency background formula to ensure legibility and performance across all platforms.

#### Scenario: Solid Background Contrast
- **WHEN** the detail sheet is displayed over a complex map area
- **THEN** the background SHALL use `rgba(255, 255, 255, 0.9)` (Light Mode) or `rgba(28, 28, 30, 0.9)` (Dark Mode)
- **AND** MUST NOT utilize `expo-blur` or `SafeBlurView` components.
