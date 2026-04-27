## Why

The recent migration to a theme-aware architecture has introduced visual regressions in the map interface, specifically in the light mode. Currently, the search filters appear bunched together without design or spacing, and the POI carousel cards are being compressed vertically ("estirado"), significantly degrading the premium user experience. This change aims to stabilize and polish these components to maintain the "Midnight Glass" aesthetic across both themes.

## What Changes

- **Thematic Stabilization**: Refactor `CategoryChip` and `POICarousel` to use dynamic theme tokens correctly, ensuring high contrast and visibility in light mode.
- **Layout Correction**: Fix the layout of the map bottom sheet to prevent vertical compression of the POI cards and horizontal bunching of category filters.
- **Styling Standardization**: Implement the new `glass.subtle` design tokens across all map components (Search Bar, Filters, Carousel, and Guides) to ensure a cohesive, premium look.
- **Responsiveness**: Ensure horizontal scroll containers in the map bottom sheet maintain their intended proportions and spacing.

## Capabilities

### New Capabilities
- `premium-glass-styling`: A standardized set of design tokens and components for the "thin glass" aesthetic, ensuring consistency across the app.

### Modified Capabilities
- `map-exploration-interface`: The requirements for rendering category filters and POI discovery content are being refined to ensure proper spacing and aspect ratios.

## Impact

- **Components**: `CategoryChip.tsx`, `POICarousel.tsx`, `SearchFilters.tsx`, `MapBottomSheet.tsx`, `GuidesSection.tsx`.
- **Styles**: `theme.ts`, `semanticColors.ts`.
- **User Experience**: Restores readability and visual appeal of the main discovery interface on the map.
