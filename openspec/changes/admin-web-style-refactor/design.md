## Context

The migration to HeroUI v3 (NextUI v3) and Tailwind CSS v4 has left the `admin-web` in a state of technical debt. Tables are failing to build due to API changes, and the visual hierarchy is disjointed due to legacy styling patterns. We need a CSS-first approach using Tailwind v4's design system capabilities.

## Goals / Non-Goals

**Goals:**
- Fix all `admin-web` build errors and runtime crashes related to HeroUI v3.
- Standardize typography across the dashboard (14px base).
- Improve Dark Mode aesthetics by refining surface colors and text contrast.
- Establish a scalable pattern for admin pages using Tailwind v4 CSS variables.

**Non-Goals:**
- Changing the backend API structure.
- Refactoring the mobile app (unless design tokens shared via `@app/theme` require it).
- Adding new functional features (focus is purely on stability and style).

## Decisions

### 1. Tailwind v4 CSS Variables (Zero Hardcoding)
We will define ALL administrative styles directly in `globals.css` using the `@theme` directive.
- **Rule**: No hex codes or raw pixel values in JSX files.
- **Rationale**: Ensures a single source of truth for both Light and Dark themes and simplifies future branding changes.

### 2. HeroUI v3 Compound Components (Dot Notation)
We will migrate all Table implementations to the new v3 compound component architecture.
- Use `<Table.ScrollContainer>`, `<Table.Content>`, `<Table.Header>`, etc.
- Move selection and accessibility props (like `aria-label`) to `<Table.Content>`.
- Explicitly handle row headers using `id` on columns/rows as required by React Aria.
- **Rationale**: This is the official migration path for HeroUI v3 and is required for build stability and accessibility compliance.

### 3. Dual-Theme Surface Strategy
We will refine both themes for professional admin use:
- **Dark Mode**: Surface colors (#141413) to distinguish from background (#0A0A09).
- **Light Mode**: "Warm Light" surfaces (e.g., #F9F9F7) instead of stark white to reduce eye strain.
- **Rationale**: Improves the premium feel and usability in diverse lighting conditions.

## Risks / Trade-offs

- **[Risk]**: Reduced font size might impact readability on low-resolution screens. → **Mitigation**: Use Inter with optimized letter-spacing and 400/500/600 weight distribution.
- **[Risk]**: CSS Variable conflicts with HeroUI defaults. → **Mitigation**: Use specific prefixes (e.g., `--admin-font-base`) if naming collisions occur.
