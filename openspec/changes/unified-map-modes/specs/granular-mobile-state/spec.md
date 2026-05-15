## ADDED Requirements

### Requirement: Mode-Driven Store Integration
Store actions that affect the application's visual state SHALL be integrated with the unified `uiState` to ensure atomicity of UI transitions.

- **Atomicity**: Setting a new `uiState` MUST be the single trigger for all related side effects in other stores (clearing selections, stopping navigation, etc.).
- **Consistency**: Components MUST NOT use individual boolean flags (e.g. `isNavigating`) if the information is already represented by the `uiState`.

#### Scenario: Unified cleanup on mode change
- **WHEN** `setUIState(EXPLORING)` is called
- **THEN** the system SHALL automatically clear any active route in `useNavigationStore` and any active POI in `usePOIStore`.
