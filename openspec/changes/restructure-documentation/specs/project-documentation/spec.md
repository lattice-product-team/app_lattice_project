## ADDED Requirements

### Requirement: Documentation Structure
The project documentation SHALL be organized into 10 distinct folders (a through j) with English lowercase names.

#### Scenario: Documentation root check
- **WHEN** a user navigates to the `/docs` directory
- **THEN** they SHOULD see subdirectories `a-summary-presentation`, `b-planning`, `c-design`, `d-source-code`, `e-technical-documentation`, `f-functional-commercial-presentation`, `g-demo`, `h-technical-presentation`, `i-user-manual`, and `j-pitch`.

### Requirement: Markdown Entry Points
Each documentation folder SHALL contain a `README.md` as its primary entry point.

#### Scenario: Subdirectory navigation
- **WHEN** entering any of the 10 folders
- **THEN** a `README.md` file MUST be present.

### Requirement: Project Entry Point
The root `README.md` SHALL be updated to serve as the primary entry point, providing links to all 10 documentation sections.

#### Scenario: Navigation from root
- **WHEN** a user opens the project on GitHub
- **THEN** the README.md MUST contain a table of contents linking to the 10 English folders.

### Requirement: Technical Documentation Integration
The technical documentation (Section e) SHALL include the API documentation and code structure explanation, starting from `/docs/e-technical-documentation/README.md`.

#### Scenario: Developer onboarding
- **WHEN** a new developer reads the technical documentation
- **THEN** they SHALL find clear instructions on the code organization and how to contribute.

### Requirement: Visual Assets and Media
Sections G (Demo) and J (Pitch) SHALL contain links to video files, and Section C (Disseny) SHALL include rendered diagrams (UML, E/R) and wireframes.

#### Scenario: Asset verification
- **WHEN** accessing Section G
- **THEN** there MUST be a clear reference or link to the demo video file.
