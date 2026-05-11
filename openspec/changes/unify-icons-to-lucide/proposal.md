## Why

The current mobile application uses a mixture of multiple icon libraries, including `lucide-react-native`, `@expo/vector-icons` (Feather, MaterialCommunityIcons, Ionicons), and potentially others. This fragmentation leads to:
- **Visual Inconsistency**: Differing line weights, corner radii, and artistic styles across the UI.
- **Limited Design Control**: `@expo/vector-icons` doesn't natively support dynamic `strokeWidth` adjustments, making it difficult to achieve a consistent "premium" look.
- **Maintenance Overhead**: Developers must choose between multiple libraries, leading to arbitrary decisions and inconsistent code patterns.

Unifying to Lucide provides a modern, cohesive, and highly customizable icon system that aligns with our "Inline & Chromatic" design philosophy.

## What Changes

- **Library Consolidation**: Transition all UI components to use `lucide-react-native` exclusively.
- **Standardization**: Enforce a global icon style (e.g., standard `size` and `strokeWidth`) across the app.
- **Removal**: Deprecate the direct usage of `@expo/vector-icons` in custom components where a Lucide equivalent exists.
- **Refactoring**: Update core components including `FloatingSearchBar`, `AdaptiveControlOverlay`, `DiscoveryDashboard`, and `SearchExperience`.

## Capabilities

### New Capabilities
- None: This is a refactoring of the visual presentation layer.

### Modified Capabilities
- `mobile-ui-system`: Standardize the icon language across all UI components as part of the core design system.
- `map-interface`: Update all map-related controls and overlays to use unified Lucide icons.

## Impact

- **Affected Code**: Most UI components in `apps/mobile/src/components` and `apps/mobile/src/features`.
- **Dependencies**: Increased reliance on `lucide-react-native`.
- **Systems**: No backend impact; purely a frontend visual and architectural cleanup.
