## MODIFIED Requirements

### Requirement: Atomic State Selection

Components MUST only subscribe to specific, necessary slices of specialized specialized stores (Navigation, UI, POI) to avoid unnecessary re-renders when unrelated state changes.

#### Scenario: Selection Isolation

- **WHEN** the `currentRoute` in `useNavigationStore` is updated
- **THEN** a component subscribed only to `selectedPoiId` in `usePOIStore` MUST NOT re-render.

## ADDED Requirements

### Requirement: Store Decomposition

The legacy `useMapStore` SHALL be decomposed into specialized domain-specific stores.

#### Scenario: Accessing Navigation State

- **WHEN** a component needs route information
- **THEN** it SHALL use `useNavigationStore` instead of the legacy `useMapStore`.
