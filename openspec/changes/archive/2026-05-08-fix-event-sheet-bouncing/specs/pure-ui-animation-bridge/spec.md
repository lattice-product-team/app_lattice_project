## ADDED Requirements

### Requirement: Cierre Orquestado (Wait-for-Finish)
El sistema SHALL completar la animación de cierre visual (`islandState` -> 0) antes de ejecutar cualquier limpieza de estado en el hilo de JS (React).

#### Scenario: Cierre mediante botón X o Arrastre
- **WHEN** el usuario pulsa el botón de cerrar o arrastra el panel hacia abajo (punto de snap 0)
- **THEN** el sistema SHALL ejecutar `withSpring(0)` en el hilo de UI
- **THEN** una vez terminada la animación visual, se SHALL invocar el callback `onClose` de React para limpiar el estado seleccionado.

### Requirement: Sincronización Protegida (Guarded Entry)
Las transiciones automáticas disparadas por cambios en el estado global (`uiLayer` o `externalState`) SHALL ejecutarse únicamente si el panel está en estado `HIDDEN` (0).

#### Scenario: Apertura Inicial de Detalles
- **WHEN** `uiLayer` cambia a `EVENT` y el panel está actualmente en 0 (`HIDDEN`)
- **THEN** el sistema SHALL animar el panel automáticamente hasta el punto `MID` (0.5).

#### Scenario: Prevención de Rebote en Pantalla Completa
- **WHEN** el panel está en posición `FULL` (1.0) y se recibe una señal de `externalState` activo (1)
- **THEN** el sistema SHALL ignorar la señal de volver a `MID` (0.5) para evitar que el panel rebote hacia abajo mientras el usuario lo está usando.

### Requirement: Calibración de Físicas Premium
El sistema SHALL utilizar una configuración de muelle optimizada para paneles de información que proporcione una respuesta rápida pero controlada.

#### Scenario: Transición entre Niveles
- **WHEN** el panel cambia entre puntos de snap (0, 0.5, 1)
- **THEN** se SHALL utilizar una configuración de muelle con `damping: 20` y `stiffness: 90` para evitar oscilaciones excesivas pero mantener la sensación de peso.
