## Context

We need to bridge the gap between the dark authentication flow and the light map interface. The goal is to use translucency to maintain context while introducing the "Midnight" palette.

## Goals / Non-Goals

**Goals:**

- Implement `tint="dark"` for all `SafeBlurView` instances in map sheets.
- Redesign `SearchBar` to be more compact and integrated.
- Standardize "Solar Gold" for all primary interactions (buttons, icons).

**Non-Goals:**

- Modifying the underlying MapLibre map tiles/styles (focusing only on UI overlays).

## Decisions

### 1. Midnight Glass for Bottom Sheets

- **Decision**: Update `MapBottomSheet` and `PoiDetailSheet` background components to use `tint="dark"` and `intensity={85}`.
- **Rationale**: Provides a consistent premium feel that matches the Auth flow while allowing the map colors to bleed through subtly.

### 2. Redesign SearchBar for Integration

- **Decision**: Remove the separate "SearchContainer" padding and place the `SearchBar` as a floating element with a very subtle border (`rgba(255,255,255,0.1)`).
- **Rationale**: Mimics the Apple Maps look where the search bar is part of the sheet content but feels elevated.

### 3. Solar Gold Iconography

- **Decision**: Change primary icons (User, Search, Share) to use `colors.primary` (Solar Gold) when active or as accents.
- **Rationale**: Reinforces brand identity within the dark context.

## Risks / Trade-offs

- **[Risk]** Readability on dark blur. → **Mitigation**: Use high-contrast white/silver text variants for all sheet content.
