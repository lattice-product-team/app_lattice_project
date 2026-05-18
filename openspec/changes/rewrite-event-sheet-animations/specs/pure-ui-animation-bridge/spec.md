## ADDED Requirements

### Requirement: Montaje Persistente y Estado Fantasma

El sistema SHALL mantener el `EventDetailSheet` montado en el árbol de componentes de React incluso cuando no hay ningún evento seleccionado.

#### Scenario: Cierre de detalles

- **WHEN** el usuario cierra el panel (evento seleccionado -> null)
- **THEN** el sistema SHALL animar `islandState` hasta 0
- **THEN** el sistema SHALL establecer `pointerEvents="none"` en el contenedor una vez que la posición sea inferior a un umbral de seguridad (e.g., 0.1)

### Requirement: Sincronización de Apertura Derivada

El panel SHALL reaccionar automáticamente a la presencia o ausencia de datos de evento.

#### Scenario: Selección de nuevo evento

- **WHEN** la prop `event` cambia de `null` a un objeto válido
- **THEN** el sistema SHALL disparar una animación `withSpring` hacia el nivel 0.5 (MID) automáticamente.

### Requirement: Gesto Simultáneo de Nueva Generación

El sistema SHALL permitir el arrastre del panel y el scroll del contenido interno de forma coordinada, priorizando la expansión del panel sobre el scroll de contenido hasta alcanzar el nivel máximo.

#### Scenario: Expansión desde MID a FULL

- **WHEN** el usuario arrastra hacia arriba desde el nivel 0.5
- **THEN** el panel SHALL expandirse hasta el nivel 1.0 antes de permitir que el `ScrollView` interno capture el movimiento.
