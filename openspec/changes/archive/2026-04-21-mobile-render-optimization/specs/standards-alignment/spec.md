## ADDED Requirements

### Requirement: React Native Render Optimization
The mobile application SHALL utilize memoization (`React.memo`, `useMemo`, `useCallback`) and granular store selectors to minimize re-renders of heavy UI components, specifically those involving maps or AR.

#### Scenario: Optimized Map Renders
- **WHEN** a minor UI state change occurs (e.g., a filter chip is toggled)
- **THEN** the `MapContent` component MUST NOT re-render unless the map data itself has changed.
