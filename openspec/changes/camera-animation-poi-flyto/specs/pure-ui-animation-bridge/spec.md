## ADDED Requirements

### Requirement: Sincronización UI-Mapa

El puente de animación SHALL permitir la sincronización opcional entre transiciones de la UI (ej. apertura de un bottom sheet) y animaciones de la cámara del mapa.

#### Scenario: Apertura de detalle con FlyTo

- **WHEN** se inicia la transición visual al detalle de un POI (`islandState` hacia 1.0)
- **THEN** se DEBE poder disparar simultáneamente una animación `flyTo` en el mapa
- **THEN** ambas animaciones DEBEN mantener una cadencia visual coordinada (easing similar).
