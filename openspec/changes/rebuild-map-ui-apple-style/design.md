## Context

The current map UI is composed of several independent components (`MapHUD`, `MapBottomSheet`, `PoiDetailSheet`) that attempt to manage their own layout and visibility. This has led to "z-index wars", overlapping buttons, and an "Island" effect that is easily broken during state transitions. The mobile application currently uses `@gorhom/bottom-sheet` and `react-native-reanimated`, which provide the necessary tools for a high-fidelity reconstruction.

## Goals / Non-Goals

**Goals:**
- **Unified Architecture**: A single source of truth for the map's interactive layer.
- **Permanent Island Look**: A robust layout that maintains margins and rounded corners in all states (Compact, Medium, Full).
- **Synchronized Overlays**: Controls that track the sheet header with zero latency.
- **Design Consistency**: Strict adherence to "Midnight Glass" tokens (32px radius, 90 blur).

**Non-Goals:**
- Implementing new map features like routing or search logic (logic exists, only UI is being rebuilt).
- Redesigning the Profile or Settings screens.

## Decisions

### 1. Unified Sheet Orchestrator
Instead of rendering multiple sheets, we will implement a single `MapSheetManager` that wraps a single `BottomSheet` component.
- **Rationale**: Rendering multiple sheets causes conflicts in gesture handling and overlay positioning. A single sheet that swaps internal content (`ExplorerView` vs `DetailView`) is more stable.
- **Alternative**: Keeping separate sheets. **Rejected** due to the difficulty of synchronizing the "Island" margins across different components.

### 2. Animated Control Positioning
The floating controls (3D, Recenter, Binoculars) will be contained in an `Animated.View` positioned at `top: 0`.
- **Rationale**: By using the `animatedPosition` shared value from the `BottomSheet`, we can calculate the controls' `translateY` as `sheetPosition.value - OFFSET`. This ensures they always sit perfectly above the sheet.
- **Alternative**: Using `absolute` positioning inside the sheet. **Rejected** because it clips the buttons when the sheet is collapsed.

### 3. Native Detached Mode
We will utilize the `detached={true}` property of the `@gorhom/bottom-sheet` library combined with `bottomInset`.
- **Rationale**: This is the library's native implementation for "floating cards". It handles the `marginHorizontal` and `borderRadius` correctly across snap points.

## Risks / Trade-offs

- **[Risk]** Heavy blur intensity affecting performance on older devices. → **[Mitigation]** Use `SafeBlurView` which defaults to a solid background if the device is underpowered.
- **[Risk]** Keyboard covering the "Island" sheet. → **[Mitigation]** Use the `keyboardBehavior="extend"` property to ensure the sheet stays accessible when searching.
- **[Risk]** Complex snap point calculations. → **[Mitigation]** Use percentages for height and `useSafeAreaInsets` for the `bottomInset` gap.
