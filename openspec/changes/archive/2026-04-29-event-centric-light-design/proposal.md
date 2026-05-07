## Why

The project is pivoting from a specialized "Circuit-only" navigation tool to a broad "Event Experience" platform. This requires a more accessible, modern, and vibrant aesthetic. Following industry standards set by Apple Maps, we are transitioning to a premium Light Theme that prioritizes clarity, semantic coloring, and high-fidelity UI elements (glassmorphism, soft shadows).

## What Changes

- **Visual Identity**: Transition from "Deep Wine/Dark" to "Solar Gold/Light".
- **Domain Shift**: Rename and refactor components from "Circuit/Racing" terminology to "Event/Experience".
- **UI Architecture**: Implementation of a floating card system with native BlurView (frosted glass) effects.
- **Map Experience**: Switch MapLibre style to a light variant (e.g., Positron) with a new vibrant semantic POI palette.
- **Iconography**: Adoption of a consistent, enclosed icon system for event categories (Food, Music, Info, etc.).

## Capabilities

### New Capabilities

- `event-centric-navigation`: Logic specialized for large-scale temporary events.
- `light-theme-system`: Full support for light mode with a specialized yellow-based palette.

### Modified Capabilities

- `map-interaction`: Unified interaction patterns for both light and dark modes (future-proofing).

## Impact

- `apps/mobile`: Major refactor of the styles directory and main UI components.
- `docs/`: Update of system prompts and product documentation to reflect the event-centric focus.
- `@app/types-schema`: Addition of new event-specific metadata for POIs.
