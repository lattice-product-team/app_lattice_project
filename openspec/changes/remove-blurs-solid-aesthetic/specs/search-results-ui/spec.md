## MODIFIED Requirements

### Requirement: Level 3 Search View
The system SHALL replace the Discovery Dashboard with a Search Experience view when searching is active in Level 3. The search experience header and result container SHALL utilize a high-opacity solid background to ensure maximum contrast for text input.

#### Scenario: Entering search mode
- **WHEN** the user focuses the search bar while the island is in Level 3
- **THEN** the UI displays the "Recent Searches" and "Available Events" sections
- **AND** the header background MUST use a solid color (0.9 opacity) instead of a blurred translucent layer.
