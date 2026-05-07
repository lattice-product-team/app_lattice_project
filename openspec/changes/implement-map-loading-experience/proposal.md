## Why

La experiencia actual de carga del mapa en Lattice presenta parpadeos (flickering), tiles cargándose a trozos y momentos en los que se ve una cuadrícula vacía antes de aplicar el estilo. Esto resta calidad percibida y rompe la estética "Midnight" de la aplicación. Necesitamos una transición fluida y profesional que oculte la complejidad técnica de MapLibre y MapTiler, ofreciendo una sensación de "app de lujo".

## What Changes

- **Background Style Pre-fetching**: Inicio de la descarga y procesamiento de los estilos de MapTiler (`light` y `dark`) desde el arranque de la aplicación para minimizar el tiempo de espera en el componente del mapa.
- **Midnight Reveal Overlay**: Un nuevo componente de interfaz de alta fidelidad que cubre el mapa durante su inicialización. Incluye:
  - Fondo con gradiente Midnight y efecto de desenfoque (Blur).
  - Animación de "pulso" o "generación" de datos para indicar carga activa.
- **Estado de Sincronización**: Implementación de lógica para detectar cuándo el mapa base está realmente listo (`onDidFinishLoadingMap`) antes de revelar la interfaz.
- **Transición Premium**: Animación de desvanecimiento suave (fade-out) y escalado para revelar el mapa, eliminando el "pop-in" brusco de elementos.

## Capabilities

### New Capabilities

- `map-loading-orchestration`: Sistema centralizado para gestionar los estados de carga, pre-carga de estilos y transiciones visuales del mapa.

### Modified Capabilities

- (ninguna)

## Impact

- **`apps/mobile/app/_layout.tsx`**: Integración del disparador de pre-carga de estilos.
- **`apps/mobile/src/features/map/hooks/useMapStyle.ts`**: Optimización para soportar pre-fetching fuera del ciclo de vida de un componente.
- **`apps/mobile/src/features/map/components/MapContent.tsx`**: Inclusión del overlay y lógica de sincronización de eventos de MapLibre.
- **`apps/mobile/src/features/map/store/useMapUIStore.ts`**: Nuevo estado global para coordinar la visibilidad del loading.
