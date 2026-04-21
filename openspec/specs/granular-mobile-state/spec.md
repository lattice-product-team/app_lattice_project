# Granular Mobile State Specification

## Requirements

### Requirement: Atomic State Selection
Components MUST only subscribe to specific, necessary slices of the global store to avoid unnecessary re-renders when unrelated state changes.

#### Scenario: Selection Isolation
- **WHEN** the `currentRoute` in `useMapStore` is updated
- **THEN** a component subscribed only to `selectedPoiId` MUST NOT re-render.

### Requirement: Avoid Prop Drilling for Global State
Global state variables (like user coordinates or UI state) SHALL NOT be passed down via props through more than one level if they can be accessed directly via a store selector.

#### Scenario: Direct Store Access
- **WHEN** `MapContent` needs `isNavigating` status
- **THEN** it MUST use a selector from `useMapStore` instead of receiving it as a prop from `MainScreen`.
