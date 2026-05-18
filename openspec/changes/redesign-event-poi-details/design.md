## Context

The current `EventDetailSheet.tsx` is a monolithic component that handles only event data. POIs use a separate `POIMiniCard.tsx` which is a simple floating card. The user wants a unified, premium experience that matches the provided reference images, which feature a complex header with images, blur effects, and a metric grid.

## Goals / Non-Goals

**Goals:**

- Unify Event and POI details into a single `PremiumDetailSheet.tsx`.
- Implement a high-fidelity "Glassmorphism" header with image backgrounds.
- Create a reusable `MetricGrid` component for quick stats.
- Implement a flexible `ActionPillBar` for primary interactions.
- Ensure smooth level-based transitions (1, 2, 3) using Reanimated.

**Non-Goals:**

- Changing the underlying data structures of Events or POIs.
- Modifying the map marker design (this is strictly for the detail sheet).

## Decisions

### 1. Unified Component Pattern

**Decision**: Use a single `PremiumDetailSheet.tsx` component and a custom hook `useDetailModel(id, type)` to provide a normalized data structure.
**Rationale**: Reduces code duplication and ensures that any visual improvements apply to both Events and POIs automatically.
**Alternatives**: Keeping separate components would make it harder to maintain visual parity.

### 2. Header Implementation

**Decision**: Use a solid dark navy background (`#0B1B32` or similar, sampled from references) with a linear gradient transition to ensure content depth.
**Rationale**: Aligns with the user's preference for specific background colors over blur effects, maintaining the premium feel through high-quality color palettes and gradients.
**Alternatives**: Using blur was considered but rejected based on user feedback.

### 3. Metric Grid and Action Pills

**Decision**: Create small, focused components (`MetricItem`, `ActionPill`) that adapt their layout based on available space.
**Rationale**: Makes the sheet responsive to different data densities (some items might have 4 metrics, others only 2).

### 4. Gesture Coordination

**Decision**: Use `react-native-gesture-handler` (GestureDetector) combined with Reanimated's `withSpring`.
**Rationale**: Essential for maintaining the "Premium Motion Physics" requirement and ensuring smooth transitions between sheet levels.

## Risks / Trade-offs

- **[Risk] Image Loading Latency** → **Mitigation**: Use a skeleton state or a default category icon as a fallback while the hero image loads.
- **[Risk] Performance with Blur** → **Mitigation**: Limit the blur area to the header section only, rather than blurring the entire sheet.
- **[Trade-off] Content Density** → We prioritize visual breathing room (large logos, margins) over fitting as much text as possible in the initial view.
