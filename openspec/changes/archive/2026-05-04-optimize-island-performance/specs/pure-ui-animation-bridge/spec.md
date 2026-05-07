## ADDED Requirements

### Requirement: Animación Desacoplada de JS

El sistema SHALL ejecutar todas las transformaciones visuales del bottom sheet en el hilo de UI sin invocar funciones de JS durante el progreso de la animación.

#### Scenario: Movimiento de la Island

- **WHEN** el usuario arrastra la Island o se activa una transición por código
- **THEN** no deben producirse actualizaciones de estado de React (`setState`) relacionadas con el progreso (`islandLevel`)
- **THEN** la fluidez debe mantenerse en 60fps constantes

### Requirement: Gestión de Visibilidad por Opacidad

La visibilidad de los componentes internos (Dashboard Nivel 2, Detalle Nivel 3) SHALL ser controlada mediante estilos animados de Reanimated.

#### Scenario: Transición de Contenido

- **WHEN** `islandState` progresa entre 0.5 y 1.0
- **THEN** `DiscoveryDashboard` debe desvanecerse mediante opacidad
- **THEN** el contenido de detalle debe aparecer mediante opacidad cruzada
- **THEN** el sistema debe gestionar `pointerEvents` para que solo el contenido visible sea interactuable
