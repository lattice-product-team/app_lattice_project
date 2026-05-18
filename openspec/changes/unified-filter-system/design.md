## Context

The mobile application uses a multi-level search "Island" interface. Level 2 (0.5 state) features a Discovery Dashboard with category chips and an event carousel. Currently, these components are purely visual and do not interact with the underlying data stores. The map, while possessing filtering capabilities in its store, does not currently apply them during the discovery phase.

## Goals / Non-Goals

**Goals:**

- Enable functional category filtering from the Level 2 Discovery Dashboard.
- Synchronize filter state across the map and the dashboard's carousel.
- Ensure visual consistency (active/inactive states) for category chips.
- Fix the existing `getFilteredPOIs` logic to respect active filters.

**Non-Goals:**

- Implementing server-side filtering (this change focuses on client-side filtering of already fetched data).
- Modifying the Level 3 (Full Search) experience beyond maintaining state.

## Decisions

### 1. Store-Level Filtering Logic

**Decision**: Fix and expand `usePOIStore.getFilteredPOIs` to be the single source of truth for filtered data.

- **Rationale**: Centralizing the logic ensures that any component using the store (Map, Carousels, Lists) gets consistent results.
- **Implementation**: Update `getFilteredPOIs` to first check if `activeCategoryFilters` is non-empty. If so, filter by `p.category` or `p.type`.

### 2. Dashboard Integration via Store

**Decision**: Connect `DiscoveryDashboard` directly to `usePOIStore` for state and actions.

- **Rationale**: Avoids "prop drilling" from `index.tsx` and allows the dashboard to react directly to state changes.
- **Alternatives**: Passing state down via props from `index.tsx`. Rejected as it makes `index.tsx` even more complex.

### 3. Event Carousel Filtering

**Decision**: Filter events in the `DiscoveryDashboard` using a `useMemo` block that combines `useSearchEvents` results with `activeCategoryFilters` from the store.

- **Rationale**: Since `useSearchEvents` fetches all events for the dashboard, client-side filtering is efficient and provides instant UI feedback.

### 4. Category Mapping

**Decision**: Use a strict mapping between `DiscoveryDashboard` category IDs and POI/Event types.

- **Mapping**:
  - `music` -> `music`, `concert`
  - `gastro` -> `food`, `restaurant`, `gastro`
  - `culture` -> `culture`, `museum`, `art`
  - `sport` -> `sport`, `fitness`
  - `night` -> `night`, `club`, `ocio`

## Risks / Trade-offs

- **[Risk] Performance with large datasets** → **Mitigation**: Filtering is done in `useMemo` hooks which are efficient for the current dataset size (~100-200 items).
- **[Risk] Filter state confusion** → **Mitigation**: Ensure filters are cleared when appropriate (e.g. when specifically selecting an event) to avoid "dead-end" states where no markers are visible.
