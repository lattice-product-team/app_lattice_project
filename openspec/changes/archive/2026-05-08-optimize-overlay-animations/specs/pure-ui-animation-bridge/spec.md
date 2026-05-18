## MODIFIED Requirements

### Requirement: Gestión de Visibilidad por Opacidad

La visibilidad de los componentes internos (Dashboard Nivel 2, Detalle Nivel 3) SHALL ser controlada mediante estilos animados de Reanimated.

#### Scenario: Transición de Contenido

- **WHEN** `islandState` progresa entre 0.5 y 1.0
- **THEN** `DiscoveryDashboard` debe desvanecerse mediante opacidad
- **THEN** el contenido de detalle debe aparecer mediante opacidad cruzada
- **THEN** el sistema debe gestionar `pointerEvents` para que solo el contenido visible sea interactuable

## ADDED Requirements

### Requirement: Transparency Level Handling (ST/NT)

The system SHALL handle transparency transitions based on the current level of the dropdown/sheet.

#### Scenario: Level 3 Non-Transparency

- **WHEN** Main Dropdown is at Level 3
- **THEN** background opacity SHALL be 1.0 (Non-Transparent)
- **THEN** background color SHALL transition from glass-background to surface-background
