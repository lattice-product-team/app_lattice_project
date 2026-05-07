## Context

The application currently uses `@gorhom/bottom-sheet` for its map-based interactions. While functional, the current implementation (e.g., `MapBottomSheet`, `PoiDetailSheet`) lacks the structural separation required for "sticky" headers. Both components wrap their entire content—including headers and action rows—inside a `BottomSheetScrollView`, causing crucial UI elements to scroll out of view when the user explores details.

## Goals / Non-Goals

**Goals:**

- Implement a **Sticky Header** pattern where the Search Bar and POI Titles remain fixed at the top of the sheet.
- Synchronize **Haptic Feedback** with sheet state changes to provide tactile confirmation of snap-point engagement.
- Refine the **Snap Points** to match Apple Maps' ergonomic standards.
- Enhance the **Glassmorphism** effect with subtle borders and optimized blur intensities.

**Non-Goals:**

- Redesigning the underlying data fetching or MapStore logic.
- Implementing multi-sheet "stacking" (e.g., sheets on top of sheets).
- Adding new POI categories or search functionality.

## Decisions

### 1. Structural Refactor: Header/Body Separation

Instead of wrapping the entire component in `BottomSheetScrollView`, we will split the internal view:

- **Header Section**: Contains the Search Bar (Main Sheet) or Title/Close buttons (Detail Sheet). This remains static within the `BottomSheet` container.
- **Action Section (Detail Sheet)**: The primary action row (IR AHORA, etc.) will also be moved outside the scroll view or placed in a persistent footer area to ensure "one-tap" access.
- **Scrollable Body**: Only the supplemental content (Results, Descriptions, Photos) will remain inside `BottomSheetScrollView`.

### 2. Haptic Feedback Orchestration

We will utilize the `onChange` callback of the `BottomSheet` component.

- **Logic**: When the `index` changes, we will trigger `Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)`.
- **Rationale**: This provides a "mechanical" feel to the digital sheet, making it feel like it's snapping into a physical groove.

### 3. "Inner Glow" Style Refinement

To achieve the premium Apple look:

- **Border**: We will use a `borderWidth: 0.5` on the `CustomBackground`.
- **Color**: For dark mode, a light-colored border (`rgba(255,255,255,0.15)`) creates a "rim light" effect on the top edge, typical of high-end glass UI.

## Risks / Trade-offs

- **[Risk] Layout Overflow** → [Mitigation] Carefully calculate the height of the fixed header and apply it as a `paddingTop` or `marginTop` to the ScrollView to avoid content overlapping.
- **[Risk] Keyboard Interaction** → [Mitigation] Use `keyboardBehavior="interactive"` and ensure the sticky header doesn't obscure the focused input in the search sheet.
- **[Risk] Animation Jitter** → [Mitigation] Ensure all style changes (like opacity shifts during dragging) are handled via shared values or optimized Reanimated styles.
