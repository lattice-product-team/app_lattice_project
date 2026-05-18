## Why

La experiencia de navegación actual carece de interactividad cinematográfica y de un sistema de seguimiento reactivo. Al iniciar una ruta, la cámara no ofrece un punto de partida claro ("engagement") y el seguimiento del usuario se interrumpe fácilmente sin una forma obvia de restaurarlo, lo que genera fricción durante el uso real en exteriores.

## What Changes

- **Vuelo de Inicio (Engagement FlyTo)**: Al entrar en modo planificación o navegación, la cámara realizará un vuelo suave hacia la posición del usuario para situarlo en el contexto de la ruta.
- **Sistema de Cámara Dual (Sticky vs Free)**:
  - **Modo Sticky**: La cámara sigue la posición y orientación (heading) del usuario automáticamente, con una inclinación (pitch) de 45º para una vista tipo "perspectiva de camino".
  - **Modo Free**: Se activa automáticamente mediante gestos manuales del usuario, deteniendo el seguimiento para permitir la exploración libre.
- **Recuperación Inteligente (Recenter)**: Integración del botón de centrado para restaurar instantáneamente el "Modo Sticky" desde el modo libre.
- **Sincronización con Tickets**: Los tickets activarán automáticamente este flujo de navegación al pulsar "GO".

## Capabilities

### New Capabilities

- `navigation-camera-orchestration`: Gestión de estados de cámara (Seguimiento, Libre, Recenter) específicos para el contexto de navegación.

### Modified Capabilities

- `event-poi-orchestration`: Integración de la activación de ruta desde la selección de tickets y exploración.

## Impact

- **Componentes**: `MapCameraManager`, `MapContent`, `AdaptiveControlOverlay`.
- **Stores**: `useMapUIStore` (gestión de `cameraMode` y `triggerSource`).
- **UX**: Mejora drástica en la fluidez de navegación y sensación de control del usuario.
