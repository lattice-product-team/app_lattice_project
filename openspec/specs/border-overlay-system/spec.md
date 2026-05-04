# border-overlay-system Specification

## Purpose
This spec defines the rendering strategy for borders on clipped components to prevent visual artifacts.

## Requirements

### Requirement: Border Overlay Rendering
UI components with rounded corners and clipped content (overflow: hidden) SHALL use a separate absolute-positioned overlay view to render borders to prevent content bleeding.

#### Scenario: Rendering an overlay border
- **WHEN** a component like `SafeBlurView` is rendered
- **THEN** a `View` with `StyleSheet.absoluteFill` MUST be rendered as the last child to provide the border

### Requirement: Passthrough Interaction
The border overlay view MUST NOT intercept touch events, allowing them to pass through to the underlying content.

#### Scenario: Tapping through a border
- **WHEN** a user taps on the edge of a card covered by the border overlay
- **THEN** the `pointerEvents` property of the overlay MUST be set to "none" so the underlying button receives the tap
