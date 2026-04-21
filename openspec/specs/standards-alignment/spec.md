# Standards Alignment Specification

## Requirements

### Requirement: Coordinate Order Standardization
The system SHALL strictly follow the GeoJSON standard `[longitude, latitude]` for all coordinate representations in the shared types and internal logic.

#### Scenario: Type Consistency
- **WHEN** a developer views the `TicketInfo` or `POI` types in `@app/types-schema`
- **THEN** the coordinate field MUST be typed or documented as `[longitude, latitude]`

### Requirement: Performance-Oriented Map Rendering
The mobile application SHALL use native MapLibre layers (`SymbolLayer`, `CircleLayer`) for rendering multiple points of interest to ensure GPU acceleration and 60fps performance.

#### Scenario: iOS Rendering
- **WHEN** the map is rendered on an iOS device
- **THEN** PoIs are drawn using a single `SymbolLayer` instead of multiple `MarkerView` components

### Requirement: Design System Alignment (NativeWind)
The mobile application components SHALL use NativeWind (Tailwind) classes for styling and Design System tokens for colors and spacing.

#### Scenario: Style Migration
- **WHEN** the `MapContent` component is styled
- **THEN** it MUST use `className` with Tailwind classes instead of `StyleSheet.create`

### Requirement: React Native Render Optimization
The mobile application SHALL utilize memoization (`React.memo`, `useMemo`, `useCallback`) and granular store selectors to minimize re-renders of heavy UI components, specifically those involving maps or AR.

#### Scenario: Optimized Map Renders
- **WHEN** a minor UI state change occurs (e.g., a filter chip is toggled)
- **THEN** the `MapContent` component MUST NOT re-render unless the map data itself has changed.
