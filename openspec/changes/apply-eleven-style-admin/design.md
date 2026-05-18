## Context

The Admin Web currently has a partial implementation of the "Eleven" design system. While core tokens (Eggshell, Powder, Obsidian) are defined in `globals.css`, there is significant inconsistency in font usage, card rendering, and layout patterns across different screens. The dashboard, which is the operational priority, uses a mix of serif and sans-serif fonts but requires a more rigorous application of the "Editorial" aesthetic.

## Goals / Non-Goals

**Goals:**

- **Typography Unification**: Replace `Cormorant_Garamond` with `Waldenburg 300` (or its designated high-quality equivalent) as the primary display serif.
- **Card Standardization**: Enforce the use of `.hairline-card` (hairline shadows, no blurs) for all dashboard elements.
- **Tailwind Refinement**: Standardize the `@theme` block in `globals.css` to allow consistent usage of Eleven tokens via utility classes.
- **Dashboard Overhaul**: Fully refactor the `/` dashboard to serve as the reference implementation for the Eleven style in Admin Web.

**Non-Goals:**

- Redesigning the mobile app (out of scope).
- Adding new functionality or API integrations (strictly visual/UX refactor).
- Replacing the `@heroui/react` library (we will style its components instead).

## Decisions

### 1. Typography Implementation

We will continue using `next/font/google` but will standardize on a single Serif font that matches the "Waldenburg 300" aesthetic. Since Waldenburg is not a Google Font, we will use **Cormorant Garamond (weight: 300)** as the primary alias for `waldenburg-display` in CSS, but with custom negative tracking (-0.02em) to achieve the editorial look.

- **Rationale**: Cormorant is already in the project, it's high quality, and matches the "Apple-meets-Material" premium vibe when correctly tracked.

### 2. Hairline Elevation System

We will strictly use `rgba(0, 0, 0, 0.4) 0px 0px 1px 0px` for shadows. All cards on the Dashboard must remove large `shadow-lg` or `shadow-md` classes in favor of `.hairline-card`.

- **Rationale**: Standard elevation creates a "Material" feel that contradicts the "Eleven" flat/premium aesthetic.

### 3. Achromatic Discipline

The background will be locked to `--color-eggshell` (#fdfcfc) and text to `--color-obsidian` (#000000). Success/Warning/Danger states will use the defined `oklch` tokens but will be rendered as subtle "dots" or "pill-labels" rather than large colored surfaces.

- **Rationale**: Maintains the high-end editorial feel without visual noise.

## Risks / Trade-offs

- **[Risk] Font Legibility** → Mitigation: Ensure Waldenburg/Cormorant is only used for large displays; body text remains Inter.
- **[Risk] Low Contrast in Dark Mode** → Mitigation: Use specific `#141413` surface values in dark mode to maintain depth without shadows.
- **[Risk] Tailwind 4 Transition** → Mitigation: We are already using Tailwind 4, so we will use the new `@theme` syntax in `globals.css` for all tokens.

## Migration Plan

1. **Foundation**: Audit `globals.css` and ensure all Eleven tokens are correctly mapped to Tailwind variables.
2. **Layout**: Update `RootLayout` and `(admin)/layout.tsx` to ensure consistent background and font-family inheritance.
3. **Dashboard Refactor**: Re-implement `(admin)/page.tsx` using the new card and typography standards.
4. **Sub-page Audit**: Pass through Events and POIs pages to replace standard cards with Eleven cards.
