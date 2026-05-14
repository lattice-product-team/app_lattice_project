## MODIFIED Requirements

### Requirement: Animación Desacoplada de JS

El sistema SHALL ejecutar todas las transformaciones visuales del bottom sheet en el hilo de UI sin invocar funciones de JS durante el progreso de la animación. En Android, esto incluye el uso obligatorio de `useAnimatedStyle` con propiedades que soporten aceleración por hardware (transform, opacity).

#### Scenario: Movimiento de la Island

- **WHEN** el usuario arrastra la Island o se activa una transición por código
- **THEN** no deben producirse actualizaciones de estado de React (`setState`) relacionadas con el progreso (`islandLevel`)
- **THEN** la fluidez debe mantenerse en 60fps constantes (o el máximo soportado por el dispositivo)

## ADDED Requirements

### Requirement: Heavy Render Deferral
The system SHALL defer the rendering of complex UI elements (like the map or large lists) during high-velocity transitions on Android.

#### Scenario: Dragging to Level 3
- **WHEN** the user drags the island rapidly towards Level 3 on Android
- **THEN** the system MUST pause or simplify the rendering of the Discovery Feed background until the transition completes.
