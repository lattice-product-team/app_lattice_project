## ADDED Requirements

### Requirement: Vertical Toolbar Stacking
Toolbars containing search and filters SHALL stack their elements vertically on small viewports to maintain accessibility.

#### Scenario: Mobile filter layout
- **WHEN** the viewport width is less than 1024px
- **THEN** filters MUST stack vertically and occupy the full available width

### Requirement: Responsive Dividers
The dividers between toolbar elements SHALL transition between horizontal and vertical orientations based on the layout state.

#### Scenario: Divider orientation
- **WHEN** the toolbar is in desktop mode (horizontal)
- **THEN** it MUST use vertical dividers (`divide-x`)
- **WHEN** the toolbar is in mobile mode (stacked)
- **THEN** it MUST use horizontal dividers (`divide-y`) or appropriate spacing

### Requirement: Horizontal Table Scrolling
Administrative tables SHALL be contained within a horizontally scrollable wrapper to prevent breaking the layout on narrow screens.

#### Scenario: Table overflow
- **WHEN** a table has more columns than can fit in the viewport
- **THEN** the container MUST enable horizontal scrolling while keeping headers aligned
