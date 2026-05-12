## ADDED Requirements

### Requirement: Domain-Driven Documentation Hierarchy
The system SHALL organize documentation into five distinct top-level domains: Architecture, API, Engineering, Guides, and Product.

#### Scenario: User navigates documentation
- **WHEN** the user visits the documentation root
- **THEN** they see the five domains as the primary navigation categories

### Requirement: Meta-Data Driven Navigation
The system SHALL use `_meta.json` files in each directory to define the display order and titles of documentation pages.

#### Scenario: Documentation order update
- **WHEN** a developer updates the `_meta.json` file
- **THEN** the documentation portal reflects the new order and titles in the sidebar

### Requirement: MDX Support
The system SHALL support MDX (Markdown with JSX) for interactive documentation components.

#### Scenario: Rendering interactive charts
- **WHEN** an MDX file contains a React component
- **THEN** the documentation portal renders the interactive component correctly
