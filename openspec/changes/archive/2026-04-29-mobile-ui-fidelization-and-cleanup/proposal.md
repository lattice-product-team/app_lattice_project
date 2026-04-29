## Why

The current mobile UI feels inconsistent and cluttered. Despite architectural improvements, the user still sees the "legacy" design because high-fidelity components like the Apple-style `FloatingSearchBar` are not yet integrated. Additionally, native MapTiler POI icons (buses, schools) create visual noise that conflicts with Lattice's custom markers, and mismatched icon families are causing console warnings and UI glitches.

## What Changes

- **Visual Upgrade**: Replace the generic `SearchBar` with the premium, Apple-inspired `FloatingSearchBar`.
- **Map Cleanup**: Update `MapContent` to hide all native MapTiler POI layers (transit, education, medical, etc.) to ensure only Lattice POIs are visible.
- **Icon Unification**: Standardize icon metadata in `poiUtils.ts` and update components (`POICarousel`, `EventCarousel`) to correctly handle icon families (Feather vs MaterialCommunityIcons), eliminating all "invalid icon name" warnings.
- **Legacy Removal**: **BREAKING** Delete obsolete files in `src/components/map` and legacy search components to prevent accidental usage.

## Capabilities

### New Capabilities
- `mobile-ui-fidelization`: Core requirements for the premium Apple-style interaction layer and map visual standards.

### Modified Capabilities
- `poi-visuals`: Update requirements to explicitly exclude native map POIs.

## Impact

- `apps/mobile/src/features/map/components/MapContent.tsx`: Layer hiding logic.
- `apps/mobile/src/features/map/components/MapHUD.tsx`: Search bar integration.
- `apps/mobile/src/utils/poiUtils.ts`: Icon mapping synchronization.
- `apps/mobile/src/components/ui/FloatingSearchBar.tsx`: Promotion to primary search component.
- `apps/mobile/src/components/map/`: Deletion of legacy directory.
