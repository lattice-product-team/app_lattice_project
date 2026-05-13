## ADDED Requirements

### Requirement: Global Layout Safe-Area
The admin interface SHALL provide a consistent top margin to prevent fixed navigation elements from obscuring page content.

#### Scenario: Page content visibility
- **WHEN** any admin page is rendered within the AdminLayout
- **THEN** the main content area MUST start below the floating navigation bar (approx. 96px from the top)

### Requirement: Responsive Navigation Grouping
The FloatingNav and Logout elements SHALL adjust their positioning on smaller viewports to prevent collision.

#### Scenario: Mobile viewport alignment
- **WHEN** the viewport width is less than 768px
- **THEN** the FloatingNav and Logout elements MUST be grouped or repositioned to avoid overlapping each other

### Requirement: Fixed Vertical Scroll Containment
The AdminLayout SHALL maintain a fixed-height viewport while allowing internal vertical scrolling.

#### Scenario: Content overflow
- **WHEN** the page content exceeds the viewport height
- **THEN** the `main` container MUST scroll vertically without moving the fixed navigation elements
