## ADDED Requirements

### Requirement: Lattice Precision Aesthetics
The admin interface SHALL follow the "Lattice Precision" style guide, which emphasizes minimalist, industrial, and editorial design elements.

#### Scenario: Global Typography and Colors
- **WHEN** any admin page is loaded
- **THEN** the header uses `waldenburg-display` (Serif) typography and technical labels use `text-[10px] font-black uppercase tracking-widest text-gravel`.

### Requirement: Standardized Input Components
All text inputs within the admin application SHALL use the standardized Lattice variant to ensure visual consistency and technical feel.

#### Scenario: Default Input Styling
- **WHEN** a standard text input is rendered
- **THEN** it uses `bg-powder/40` as the background, `rounded-none` (no corner radius), and a `chalk` border.

### Requirement: Standardized Button Components
All buttons SHALL use the standardized Lattice variants (primary, ghost, tab, compact) to maintain a consistent interactive language.

#### Scenario: Primary Button Appearance
- **WHEN** a primary button is rendered
- **THEN** it uses `bg-obsidian` background, `text-eggshell` text, and `shadow-subtle-2` for elevation.

### Requirement: Login Interface Alignment
The login screen SHALL be aligned with the admin UI standards to provide a cohesive entry point into the operations center.

#### Scenario: Login Card and Background
- **WHEN** the user visits the login page
- **THEN** the background is clean `bg-eggshell` and the login card uses `bg-white/80 backdrop-blur-md` with `shadow-massive` and `border-chalk`.
