## Context

The mobile app currently utilizes a fragmented icon system. `@expo/vector-icons` is used for many base components, while `lucide-react-native` has been introduced in more recent "premium" feature sets. This fragmentation makes it difficult to maintain a consistent visual language, especially regarding line weights and stylistic coherence.

## Goals / Non-Goals

**Goals:**
- Replace all direct imports of `Feather`, `MaterialCommunityIcons`, and `Ionicons` from `@expo/vector-icons` with their Lucide equivalents.
- Establish a standard `strokeWidth` (default 2.0 or 2.2) and `size` pattern for the application.
- Maintain existing icon meanings (e.g., if a compass was used for "Explore", a Lucide compass should replace it).

**Non-Goals:**
- Changing the functional meaning of any icons.
- Redesigning the entire layout or navigation structure.
- Modifying backend icon mappings (these will be mapped at the frontend level).

## Decisions

### 1. Mapping Strategy: Direct Replacement
For each icon currently in use, we will identify the closest Lucide equivalent.
- **Feather Icons**: Most have direct 1:1 matches in Lucide as Lucide is a fork of Feather.
- **Material Icons**: We will map them to the closest Lucide semantic equivalent (e.g., `MaterialCommunityIcons.map-marker` -> `Lucide.MapPin`).

### 2. Standardization: Global Styling Props
Instead of varying icon weights, we will standardize on:
- **Stroke Width**: 2.0 for standard UI, 2.5 for emphasized markers.
- **Sizes**: 18px for small buttons, 20px/24px for standard UI elements.

### 3. Component Refactoring: Lucide Wrapper
For components that use icons dynamically (like `POIMarker`), we will continue using the mapping object pattern but ensure all entries point to Lucide components.

## Risks / Trade-offs

- **[Risk] Missing Icons** → Lucide has a vast library, but some very niche Material icons might not have a direct vector match. 
  - **Mitigation**: Use the most semantically appropriate Lucide alternative or create a custom SVG if absolutely necessary.
- **[Risk] Performance** → Lucide icons are SVG-based components, while Expo icons are font-based. 
  - **Mitigation**: The impact is negligible for a few dozen icons on screen. Use `React.memo` for static icons if any lag is detected.
