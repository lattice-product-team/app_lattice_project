## ADDED Requirements

### Requirement: Vuelo Inicial al Usuario

El sistema SHALL realizar una animación suave hacia la posición del usuario cuando se activa el modo de planificación de rutas.

#### Scenario: Inicio de ruta desde Ticket/Explore

- **WHEN** el estado `isPlanning` cambia a `true`
- **THEN** la cámara DEBE realizar un `flyTo` a `userCoords`
- **THEN** el nivel de zoom DEBE ser 17 y la inclinación DEBE ser 45º.

### Requirement: Seguimiento Inteligente (Sticky Camera)

El sistema SHALL mantener la cámara centrada en el usuario y orientada según su rumbo (heading) durante la navegación activa.

#### Scenario: Seguimiento automático

- **WHEN** el `cameraMode` es `FOLLOW_WITH_HEADING`
- **THEN** la cámara DEBE actualizar su posición y rotación automáticamente al ritmo del movimiento del usuario.

### Requirement: Ruptura de Seguimiento por Gesto

El sistema SHALL permitir al usuario tomar el control manual del mapa, desactivando el seguimiento automático.

#### Scenario: Gesto manual durante navegación

- **WHEN** la cámara está en modo seguimiento
- **AND** el usuario realiza un gesto de pan/zoom en el mapa
- **THEN** el `cameraMode` DEBE cambiar a `FREE`
- **THEN** el seguimiento automático DEBE detenerse inmediatamente.
