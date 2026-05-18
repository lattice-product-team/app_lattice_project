## Why

En dispositivos Android, la cámara del mapa se teletransporta instantáneamente y de forma continua a la posición del usuario en el momento en que se intenta realizar cualquier gesto de arrastre (paneo) en el mapa. Esto crea un efecto de "imán" irrompible que inutiliza la exploración manual del mapa desde el arranque, debido a que el componente composite `<MapCameraManager />` es desmontado y vuelto a montar continuamente por la reconciliación y aplanamiento de vistas nativas de Android bajo `<MapLibreGL.MapView />`, reiniciando sus estados internos y re-ejecutando indefinidamente el efecto de encuadre inicial sin animación.

## What Changes

- **Aplanamiento de la Jerarquía de Renderizado**: Se elimina el componente compuesto intermediario `<MapCameraManager />` como hijo directo de la vista nativa de MapLibre.
- **Integración Directa en MapContent**: Se migra toda la lógica del controlador de la cámara (snaps, fly-tos, seguimiento nativo de iOS y seguimiento manual en Android) directamente a `MapContent.tsx`.
- **Renderizado Nativo Directo**: Se renderiza el componente de cámara nativo `<MapLibreGL.Camera />` como un hijo plano directo de `<MapLibreGL.MapView />`, cumpliendo con las directrices oficiales del puente nativo para prevenir el aplanamiento e inestabilidad de vistas en Android.
- **Estabilidad Absoluta del Estado de Arranque**: El estado `hasInitialized.current` se declara y mantiene dentro de `MapContent.tsx`, el cual nunca se desmonta mientras la pantalla del mapa esté activa, garantizando que el encuadre inicial al usuario ocurra estrictamente una única vez al arrancar la aplicación.

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `decoupled-location-management`: Se refina el requerimiento de seguimiento visual para garantizar que el encuadre inicial (startup centering) ocurra estrictamente una sola vez y no interfiera con el paneo manual del usuario.

## Impact

- **Componentes Afectados**:
  - [MapContent.tsx](file:///Users/kore/Documents/Code/Projects/app_lattice_project/apps/mobile/src/features/map/components/MapContent.tsx): Recibirá el estado de la cámara, los manejadores (useImperativeHandle deja de ser necesario ya que las referencias de cámara se resuelven localmente) y los efectos de ciclo de vida de la cámara.
  - [MapCameraManager.tsx](file:///Users/kore/Documents/Code/Projects/app_lattice_project/apps/mobile/src/features/map/components/MapCameraManager.tsx): Este archivo será eliminado por completo para simplificar la arquitectura.
- **Rendimiento**: Mayor estabilidad en Android al eliminar renders redundantes causados por el puente nativo.
- **Experiencia de Usuario**: Transición fluida inicial de la cámara y control de paneo manual 100% receptivo sin bloqueos ni teletransportaciones.
