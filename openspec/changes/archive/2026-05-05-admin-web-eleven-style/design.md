## Context

The `admin-web` dashboard is currently undergoing a style refactor to stabilize HeroUI v3 and Tailwind v4. The "ElevenLabs" style reference provides a definitive visual blueprint that prioritizes typography and a warm, achromatic palette. We need to implement this as a scalable design system using Tailwind v4's `@theme` directive.

## Goals / Non-Goals

**Goals:**
- Implement the "Eggshell" (#fdfcfc) based color system with near-zero saturation.
- Map the "Waldenburg" (serif) and "Inter" (sans) typography system to Tailwind tokens.
- Standardize UI components (Pills, Cards, Inputs) with specific border-radius and shadow logic.
- Ensure the system is fully theme-agnostic (focusing on the "Warm Light" mode first as per reference).

**Non-Goals:**
- Developing a full Dark Mode variant of the style unless explicitly defined later (focus is on the "Eggshell" ground).
- Modifying backend business logic or data structures.

## Decisions

### 1. Tailwind v4 Token Mapping
We will use the `@theme` block in `globals.css` to define the tokens.
- **Colors**: Map `Eggshell`, `Powder`, `Chalk`, `Gravel`, and `Obsidian` to semantic Tailwind colors.
- **Rationale**: Tailwind v4 variables are the most performant and scalable way to manage a unified theme.

### 2. Typography Substitution Strategy
Since "Waldenburg" is a custom font, we will use high-fidelity substitutes to maintain the aesthetic without requiring premium licenses immediately.
- **Headlines**: Use `Cormorant Garamond` (weight 300, tracking -0.02em) or `Libre Baskerville`.
- **Labels**: Use `Inter` (weight 700, tracking 0.05em) as a substitute for `WaldenburgFH`.
- **Rationale**: Web-safe and Google Fonts alternatives provide immediate implementation while remaining visually close to the source.

### 3. Hairline Shadow Elevation
Instead of standard elevation depth, we will use the specific shadow logic: `rgba(0, 0, 0, 0.4) 0px 0px 1px 0px`.
- **Rationale**: This keeps the UI in a single perceptual plane, reinforcing the editorial/architectural feel.

### 4. Pill-Shaped Component Architecture
All buttons and tags will be forced to `9999px` border-radius.
- **Rationale**: This creates a strong contrast against the sharp `0px` radius of input fields, defining a clear interaction language.

## Risks / Trade-offs

- **[Risk]**: The "Eggshell" background might look like a "failed white" on poorly calibrated monitors. → **Mitigation**: Ensure high contrast for text (Obsidian #000000) and use `Chalk` (#e5e5e5) borders to define boundaries.
- **[Risk]**: Custom tracking values might cause text clipping in some browsers. → **Mitigation**: Use `tracking-tight` and `tracking-widest` equivalents or custom CSS variables with unit safety.
