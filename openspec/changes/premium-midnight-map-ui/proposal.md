## Why

The current map UI uses solid white backgrounds for bottom sheets and a basic search bar that lacks brand consistency with the recently implemented "Premium Dark" authentication flow. Users expect a cohesive experience, and the current map interface feels utilitarian rather than premium. Redesigning these elements with a "Midnight Glass" aesthetic will unify the app's visual language and improve focus on the Solar Gold highlights.

## What Changes

- **Midnight Glass Sheets**: Transform `MapBottomSheet` and `PoiDetailSheet` to use a dark translucent blur (`tint="dark"`) with refined borders.
- **Apple-Style Search Bar**: Redesign `SearchBar` to be a floating, minimal input within the bottom sheet, featuring better typography and Solar Gold focus states.
- **Unified Controls**: Update all map-related UI controls (buttons, handles, indicators) to match the high-contrast dark theme.

## Capabilities

### New Capabilities
- `midnight-glass-system`: A consistent set of styles for translucent dark UI elements across the map interface.

### Modified Capabilities
- `map-search`: Enhanced search UX with a more modern, integrated input.

## Impact

- **UI Components**: `SearchBar`, `MapBottomSheet`, `PoiDetailSheet`, `SearchFilters`.
- **User Experience**: A more immersive, sophisticated map interaction that feels native to high-end mobile devices.
