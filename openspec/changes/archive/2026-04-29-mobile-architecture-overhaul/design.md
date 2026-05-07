## Context

The Lattice mobile application has reached a point where the flat component structure and mixed state management are hindering development speed. Current UI state is tightly coupled with domain data in a single Zustand store, and theme logic is duplicated across multiple hooks.

## Goals / Non-Goals

**Goals:**

- Implement a **Feature-First** architecture (Domain-Driven Design).
- Centralize theme logic into a single, cohesive engine.
- Standardize data models using an **Adapter Pattern**.
- Improve performance by reducing unnecessary re-renders in the Map store.

**Non-Goals:**

- Rewriting the Map engine (MapLibre).
- Changing backend API contracts.
- Redesigning the visual identity (only structural/implementation changes).

## Decisions

### 1. Feature-First Directory Structure

Move from a flat `/components` structure to a grouped `/features` structure.

- **Rationale**: Groups related components, hooks, and types together, making the codebase easier to navigate and test.
- **New Structure**: `src/features/[domain]/{components, hooks, services, types}`.

### 2. Unified Theme Engine (`useAppTheme`)

Merge `useLatticeTheme` and `useEventTheme` into a single hook.

- **Rationale**: Simplifies component development. A component should only care about _which_ color to use (e.g., `primary`), not _where_ it comes from (System vs Event).
- **Implementation**: The hook will consume both `useColorScheme` and `useMapStore` (for event context) and return a merged theme object.

### 3. POI Data Normalization (Adapter Pattern)

Introduce a `poiAdapter` to transform GeoJSON features into a consistent `UIPOI` model.

- **Rationale**: Decouples the UI from the backend schema. If the backend changes `name` to `title`, we only update the adapter, not 50 components.
- **Standard**: All UI components will consume `UIPOI` which guarantees fields like `displayName`, `categoryIcon`, and `mainColor`.

### 4. Split useMapStore

Decompose the "God Store" into specialized stores.

- `useNavigationStore`: Route data, destination, navigation status.
- `usePOIStore`: Selected POI, hover states, selection logic.
- `useMapUIStore`: Snap points, sheet visibility, HUD toggles.
- **Rationale**: Better separation of concerns and improved performance via more granular state updates.

## Risks / Trade-offs

- **[Risk] Migration Instability** → **Mitigation**: Incremental migration. Start with the `Events` domain as a pilot before moving `Tickets` or `Map`.
- **[Risk] Path Hell (Imports)** → **Mitigation**: Ensure path aliases (`@/features/...`) are correctly configured in `tsconfig.json`.
- **[Trade-off] Initial Overhead** → **Mitigation**: The extra time spent creating adapters and splitting stores is offset by the reduction in future bugs and faster component development.
