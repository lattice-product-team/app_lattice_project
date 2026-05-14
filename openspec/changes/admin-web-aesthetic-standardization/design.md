## Context

The `admin-web` application is built with Next.js, Tailwind CSS v4, and HeroUI. It currently features a high-fidelity "Lattice Precision" style in the Events and POIs screens, characterized by a specific achromatic palette (`eggshell`, `powder`, `chalk`, `obsidian`), serif display typography (`waldenburg-display`), and industrial UI elements. However, the Login page and several shared components have not been fully aligned with this aesthetic, leading to a fragmented user experience.

## Goals / Non-Goals

**Goals:**
- Unify the `admin-web` aesthetic under the "Lattice Precision" style guide.
- Redesign the Login page to serve as a high-fidelity technical entry point.
- Standardize the `Input` and `Button` components to ensure visual consistency across all future screens.
- Enforce the use of established design tokens for typography, spacing, and elevation.

**Non-Goals:**
- Modifying authentication logic or API integrations.
- Extensive mobile-first refactoring (the priority is the desktop administrative experience).
- Adding new functional features to the events or pois pages.

## Decisions

### 1. "Industrial" Login Redesign
- **Decision**: Remove soft decorative blurs (`blur-3xl`) and colorful gradients.
- **Rationale**: The Lattice brand identity is built on "precision" and "restraint". Soft blurs feel too generic/consumer-oriented.
- **Implementation**: Use a clean `bg-eggshell` background with the existing noise overlay. The login card will use `bg-white/80` with `backdrop-blur-md`, `border-chalk`, and `shadow-massive` to feel like a precise instrument panel.

### 2. Standardizing the "Lattice Input"
- **Decision**: Enforce `rounded-none` and `bg-powder/40` as the default state for inputs.
- **Rationale**: Sharp corners and muted, technical backgrounds reinforce the "industrial tool" feel.
- **Implementation**: Update `src/components/ui/input.tsx` to set these as the default `contained` variant styles.

### 3. Typography Enforcement
- **Decision**: Use `waldenburg-display` for all primary headers and `text-[10px] font-black uppercase tracking-widest` for all technical metadata/labels.
- **Rationale**: This typographic contrast is the most recognizable element of the Lattice aesthetic.
- **Implementation**: Audit `login/page.tsx` and shared layout components to replace standard sans-serif headers with the serif display font.

### 4. Consistent Elevation Scale
- **Decision**: Use `shadow-subtle` for standard cards and `shadow-massive` for high-importance overlays (like the login card or map detail panels).
- **Rationale**: Keeps the interface feeling flat and technical while providing clear hierarchical depth where needed.

## Risks / Trade-offs

- **[Risk] Contrast on light backgrounds** → **Mitigation**: Ensure all text on `eggshell` or `powder` backgrounds uses `obsidian` (#000) or high-contrast `gravel` for readability.
- **[Risk] HeroUI Slot Leakage** → **Mitigation**: Continue using the Tailwind v4 `**:data-[slot=...]` pattern in component wrappers to safely style HeroUI internal slots without DOM leakage.
