## Context

The `admin-web` dashboard currently uses Tailwind CSS 4 and HeroUI for styling. The `RootLayout` is configured with a hardcoded `light` class, and the `AdminMap` component uses a fixed MapTiler style URL. The Sidebar (Control Panel) needs a persistent UI element to allow users to manually switch between Light and Dark themes.

## Goals / Non-Goals

**Goals:**

- Enable automatic theme synchronization with the user's system preferences.
- Implement a manual theme toggle in the Sidebar with animated Sun/Moon icons.
- Implement a fully functional dark mode aesthetic ("Obsidian" palette) across the entire admin dashboard.
- Dynamically switch MapTiler styles in the `AdminMap` component based on the active theme.
- Ensure zero hydration mismatches during theme initialization.

**Non-Goals:**

- Modifying themes in the `mobile` app or `docs` (out of scope for this change).

## Decisions

### 1. Choice of Theme Manager: `next-themes`

**Decision**: Use `next-themes` to manage theme state and system synchronization.
**Rationale**: It is the industry standard for Next.js applications, provides robust handling of system preferences, prevents hydration mismatches, and integrates perfectly with Tailwind's class-based dark mode.

### 2. Provider Integration

**Decision**: Wrap the application with `ThemeProvider` inside `apps/admin-web/src/app/providers.tsx`.
**Rationale**: Centralizing providers ensures that all client components (including `AdminMap` and `Sidebar`) have access to the theme context.

### 3. Theme Switch UI (ThemeToggle)

**Decision**: Create a `ThemeToggle` component positioned in a new `footer` section of the `Sidebar.tsx`.
**Rationale**: Placing it at the bottom-left of the Sidebar ensures it's always accessible without cluttering the main navigation or search areas.
**Visuals**: Use `Sun` and `Moon` icons from Lucide (added to `Icons.tsx`). Implementation will use a button that toggles between themes with a CSS transition for the icons (e.g., rotation and opacity).

### 4. Map Style Dynamic Loading

**Decision**: Utilize the `useTheme` hook from `next-themes` inside `AdminMap.tsx` to switch the `MAP_STYLE` constant to its dark variant when `resolvedTheme === 'dark'`.
**Rationale**: `resolvedTheme` accounts for the "system" setting and manual overrides, ensuring the map stays in sync with the overall UI.

### 5. Color Palette Refinement

**Decision**: Standardize on the "Obsidian" (#000000) and "Eggshell" (#fdfcfc) palette already partially defined in `globals.css`.
**Rationale**: This aligns with the "Midnight Glass" aesthetic and provides a high-end command center feel.

## Risks / Trade-offs

- [Risk] **Hydration Mismatch**: Next.js may render the "light" version on the server while the client prefers "dark".
  - [Mitigation] Use `next-themes` which handles this by injecting a script into the head, and apply `suppressHydrationWarning` to the `html` tag.
- [Risk] **Map Style Switching Latency**: Switching styles in MapLibre can cause a brief blank state while assets reload.
  - [Mitigation] MapLibre handles style transitions relatively well. We will ensure the background of the map container matches the target theme to minimize flashing.
- [Risk] **Contrast in Custom Layers**: Custom GeoJSON layers might lose visibility on a dark background.
  - [Mitigation] Audit and adjust opacity and halo properties of map layers specifically for the dark mode style.
