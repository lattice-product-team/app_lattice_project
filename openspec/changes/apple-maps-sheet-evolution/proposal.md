## Why

The current map interaction layer lacks the polish and intuitive behavior of modern mobile map applications like Apple Maps (iOS 17/18). By adopting standardized "Bottom Sheet" patterns—such as sticky headers, precise snap points, and haptic feedback—we will create a more professional, native-feeling experience that aligns with the "Midnight Glass" premium design system.

## What Changes

- **Sticky Header Implementation**: Refactor `MapBottomSheet` and `PoiDetailSheet` to ensure search bars and POI titles remain fixed at the top of the sheet during scrolling.
- **Optimized Snap Points**: Standardize sheet heights to Apple Maps-inspired ratios (e.g., Collapsed: ~10%, Medium: ~45%, Expanded: ~95%).
- **Haptic Feedback Integration**: Add tactile response (`expo-haptics`) when the sheet snaps to its anchor points, enhancing the sense of physical interaction.
- **Visual Polish**: Refine `CustomBackground` with a more sophisticated blur intensity and a 0.5px "inner glow" border to achieve a high-fidelity glass effect.

## Capabilities

### New Capabilities
- `premium-sheet-interaction`: Defines the orchestrated interaction model for map-based bottom sheets, including snap-point behavior, header stickiness, and haptic synchronization.

### Modified Capabilities
<!-- No requirement changes to existing capabilities; this is a UI/UX enhancement change. -->

## Impact

- **Components**: `MapBottomSheet.tsx`, `PoiDetailSheet.tsx`, `MapSheetManager.tsx`.
- **Dependencies**: `expo-haptics` (ensuring it's correctly linked and used).
- **Styles**: `SafeBlurView` and related theme constants in `apps/mobile/src/hooks/useLatticeTheme.ts`.
