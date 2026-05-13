## ADDED Requirements

### Requirement: Multi-image Gallery Support
The system SHALL support the display of multiple images for any Event or POI. These images SHALL be rendered in a horizontal carousel that supports swipe gestures.

#### Scenario: Navigating the gallery
- **WHEN** a user selects an Event or POI with a gallery defined
- **THEN** the system MUST render a horizontal carousel in the detail section
- **AND** the user MUST be able to swipe between different images.

### Requirement: Hero Banner Presentation
The system SHALL support a high-resolution banner image that acts as the background for the detail header. This banner MUST support a parallax or fade effect during vertical scrolling.

#### Scenario: Scrolling the detail sheet
- **WHEN** the user scrolls the Event Detail Sheet upwards
- **THEN** the banner image MUST smoothly fade out or slide to maintain focus on the text content.
