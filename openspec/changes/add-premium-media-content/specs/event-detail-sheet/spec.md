## ADDED Requirements

### Requirement: Immersive Header Rendering

The Event Detail Sheet SHALL render the header with a background banner image if available. This banner MUST use a parallax effect and fade out when the user scrolls the content.

#### Scenario: Rendering banner in detail

- **WHEN** the Event Detail Sheet opens for an entity with a `bannerUrl`
- **THEN** the header MUST show the banner image as a background
- **AND** the title and subtitle MUST be readable over the image (e.g. using gradients or shadows).
