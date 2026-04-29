## Why

The current mobile codebase has grown organically, leading to redundant components, inconsistent data handling (e.g., `name` vs `label`), and a fragmented theme system. This change establishes a professional, scalable architecture to reduce technical debt and ensure a cohesive high-fidelity experience as the application expands.

## What Changes

- **Component Reorganization**: Migration to a domain-driven structure (e.g., `/features/events`, `/features/tickets`) to separate business logic from generic UI atoms.
- **Unified Theme Engine**: Consolidation of `useLatticeTheme` and `useEventTheme` into a single, context-aware theme provider.
- **Data Normalization Layer**: Implementation of an adapter pattern to standardize backend POI data into a consistent `UIPOI` model.
- **Component Consolidation**: Removal of redundant components (e.g., merging `FloatingSearchBar` into a unified `SearchBar`).

## Capabilities

### New Capabilities
- `mobile-domain-architecture`: Defines the standards for feature-based directory structure and module boundaries.
- `mobile-data-adapter`: Establishes the contract for normalizing external data sources into unified UI models.

### Modified Capabilities
- `design-tokens`: Updating the consumption pattern to support dynamic brand overrides via a single theme hook.
- `granular-mobile-state`: Refactoring `useMapStore` into specialized domain stores (Navigation, UI, POI).
- `event-navigation`: Updating navigation logic to consume standardized POI models.

## Impact

- **Affected Code**: `apps/mobile/src/components`, `apps/mobile/src/store`, `apps/mobile/src/hooks/useLatticeTheme.ts`.
- **APIs**: No changes to backend APIs, but a new client-side transformation layer will be introduced.
- **Dependencies**: Potential introduction of `react-query` selectors for data normalization.
