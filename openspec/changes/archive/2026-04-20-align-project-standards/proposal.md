## Why

The project currently suffers from critical technical inconsistencies that jeopardize data integrity and mobile performance. Specifically, coordinate flipping risks between API and shared types, and sub-optimal map rendering on iOS that violates established performance standards.

## What Changes

- **BREAKING**: Align coordinate order in `@app/types-schema` to follow the GeoJSON standard `[longitude, latitude]`.
- **Mobile Map Refactor**: Replace `MarkerView` with native `SymbolLayer` on iOS for 60fps performance.
- **Style Consolidation**: Migrate `MapContent.tsx` from `StyleSheet` to **NativeWind** (Tailwind) and use design tokens.
- **Architecture**: Decouple routing logic from components into custom hooks.
- **Localization**: Standardize all core documentation and specifications to English.

## Capabilities

### New Capabilities

- `standards-alignment`: Ensures the codebase follows the project's performance and styling pillars.

### Modified Capabilities

- `navigation-logic`: Requirement for consistent coordinate ordering across services.

## Impact

- `@app/types-schema`: Type definitions for location will change.
- `apps/mobile`: Rendering logic in `MapContent.tsx` will be significantly refactored.
- `docs/`: Catalan documents will be translated to English.
