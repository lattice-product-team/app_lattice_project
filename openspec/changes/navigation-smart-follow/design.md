## Context

La navegación requiere que la cámara se comporte de forma pasiva (permitiendo ver el mapa) o activa (guiando al usuario). MapLibreGL ofrece `UserTrackingMode`, pero su control es rígido. Usaremos una implementación personalizada en `MapCameraManager` que reaccione al estado de navegación global.

## Goals

- Implementar el "Modo Seguimiento" usando `followUserMode={MapLibreGL.UserTrackingMode.FollowWithHeading}`.
- Romper el seguimiento automáticamente al detectar `isUserInteraction` en el mapa.
- Proporcionar un FlyTo al usuario al activar `isPlanning`.

## Decisions

### 1. FlyTo al Usuario en Planificación
- **Acción**: Al cambiar `isPlanning` de `false` a `true`, disparar `flyTo` a `userCoords` con `zoom: 17` y `pitch: 45`.
- **Razón**: Centra al usuario en el mapa justo cuando va a empezar a moverse.

### 2. Gestión de Estados (Sticky vs Free)
- **Modo Seguimiento (Sticky)**: `cameraMode: MapCameraMode.FOLLOW_WITH_HEADING`.
- **Modo Libre (Free)**: `cameraMode: MapCameraMode.FREE`.
- **Lógica**: `MapContent` detecta gestos manuales y cambia a `FREE`. El botón `Recenter` cambia de nuevo a `FOLLOW_WITH_HEADING`.

### 3. Sincronización de UI
- El botón de `Recenter` en `AdaptiveControlOverlay` debe mostrar un estado visual "activo" cuando el seguimiento está habilitado.

## Risks

- **Jank en Android**: El seguimiento continuo con heading puede ser pesado.
  - **Mitigación**: Usar el modo nativo de seguimiento de MapLibre en lugar de mover la cámara manualmente vía JS en cada frame.
