## Context

The current `admin-web` application uses a manual Tailwind CSS layout with hardcoded "F1 Red" colors. It lacks a centralized component framework, leading to inconsistent UI patterns and styling debt. We are transitioning to **HeroUI v3** (built on Tailwind v4 and React Aria) to unify the interface around the **Solar Gold** brand identity and **Inter** typography.

## Goals / Non-Goals

**Goals:**
- Implement HeroUI v3 as the core component library.
- Centralize all branding via CSS variables in OKLCH format.
- Replace the manual sidebar and navigation with HeroUI components.
- Enforce **Inter** as the primary typeface.
- Establish a "Hybrid" aesthetic: solid productivity areas (tables/forms) with glassmorphism accents for branding.

**Non-Goals:**
- Complete rewrite of business logic (only UI/UX layer).
- Integration of HeroUI into the Mobile app (Web Admin only).
- Replacing MapLibre/React Map GL (only their surrounding UI containers).

## Decisions

### 1. Framework: HeroUI v3 + Tailwind v4
**Rationale:** HeroUI v3 is optimized for the latest React (v19) and Tailwind (v4) features. Its CSS-first approach using OKLCH variables aligns perfectly with our need for a professional, high-performance dashboard.
**Implementation:** `HeroUIProvider` will wrap the entire `RootLayout`.

### 2. Color Mapping: OKLCH Bridge
**Rationale:** HeroUI v3 uses OKLCH for superior color interpolation and accessibility. We will bridge our **`@app/theme`** tokens into OKLCH variables to ensure a single source of truth across the workspace.
**Implementation:** A utility or a small script will read the Hex values from `@app/theme` and inject them as CSS variables in OKLCH format.
**Mappings:**
- `--accent`: Calculated from `colors.brand.primary` (#E2B042)
- `--surface`: Calculated from `colors.neutral.dark.surface` (#141412)

### 3. Typography: Next.js Font (Inter)
**Rationale:** Transitioning from `Lexend` to `Inter` provides a more neutral, professional tone suitable for an administration panel.
**Implementation:** Use `next/font/google` to load Inter and map it to `--font-inter`.

### 4. Layout: Drawer + Semantic Navigation
**Rationale:** Replacing the hardcoded `aside` with HeroUI's responsive components improves maintainability and mobile responsiveness.

## Risks / Trade-offs

- **[Risk] Tailwind v4 Compatibility** → **Mitigation**: Verify that `@heroui/styles` correctly imports alongside the new `@import "tailwindcss"` syntax.
- **[Risk] Performance Overhead** → **Mitigation**: Leverage HeroUI's component-level code splitting to ensure small bundle sizes.
- **[Risk] Aesthetic Shift** → **Mitigation**: Maintain the "Lattice" brand feel through targeted use of translucency in the Sidebar while keeping Data Tables opaque.
