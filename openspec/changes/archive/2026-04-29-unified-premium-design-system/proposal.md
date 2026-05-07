## Why

The current Lattice mobile application suffers from a fragmented visual identity, where recently implemented "Midnight" authentication flows clash with legacy light-themed map and profile interfaces. This inconsistency diminishes the premium feel of the brand and creates cognitive friction for users. A unified design system is needed to establish a consistent "Midnight Glass" aesthetic across all capabilities.

## What Changes

- **Unified Semantic Token System**: Replace literal color assignments with theme-aware semantic tokens across the mobile app.
- **Midnight Glass System Core**: Standardize translucency, blur intensities, and border treatments for the "Lattice Premium" look.
- **Global Theme Provider Support**: Refactor the style layer to support dynamic theme switching (Light vs. Midnight).
- **Component Refactoring**: Update core UI components (`PremiumButton`, `SearchBar`, `BottomSheet`) to consume the new semantic tokens.

## Capabilities

### New Capabilities

- `unified-theme-system`: A centralized system for managing semantic tokens and theme state.
- `premium-midnight-palette`: The official dark-mode specification for Lattice, including "Obsidian" surfaces and "Solar Gold" accents.

### Modified Capabilities

- `branding-and-coherence`: Extending existing branding specs to include specific mobile theme implementation standards.

## Impact

- **Mobile App**: `src/styles/*`, `src/components/ui/*`.
- **Developer Experience**: Standardized way to apply "Premium" styles without manual hex code handling.
- **User Experience**: Cohesive, immersive atmosphere from authentication to map exploration.
