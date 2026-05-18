## Context

Actualmente, `MapCameraManager` utiliza `snapToLocation` con `animationDuration: 0` para todos los cambios de posición. Esto es intencional para evitar comportamientos erráticos de la cámara cuando el usuario está interactuando o cuando hay actualizaciones frecuentes de ubicación. Sin embargo, para la navegación guiada (selección de POIs desde carruseles o menús), se necesita una transición suave que MapLibre ofrece a través de `setCamera` con `animationDuration` > 0 o el método `flyTo`.

## Goals / Non-Goals

**Goals:**

- Implementar un método `flyTo` en `MapCameraManager` que soporte duraciones variables y curvas de easing.
- Diferenciar programáticamente entre un "cambio brusco" (necesario para recenter) y un "vuelo suave" (para descubrimiento).
- Asegurar que las animaciones funcionen de manera idéntica en iOS y Android.
- Detener cualquier animación en curso si el usuario toca el mapa (gesto manual).

**Non-Goals:**

- Cambiar la lógica de seguimiento de ubicación del usuario (seguir en modo "snap").
- Implementar animaciones complejas de 3D o rotaciones automáticas excesivas fuera del "flyto" básico.

## Decisions

### 1. Uso de `cameraRef.current.setCamera` vs `flyTo`

- **Decisión**: Usar `setCamera` con `animationDuration` y `animationMode: 'flyTo'`.
- **Razón**: `setCamera` en `@maplibre/maplibre-react-native` es la API más completa y estable para controlar todas las propiedades (center, zoom, pitch, bearing) en un solo paso atómico, permitiendo mayor control sobre el `animationMode`.

### 2. Intercepción por `triggerSource`

- **Decisión**: Añadir un flag o campo `triggerSource` en el estado de selección de POIs (`useMapUIStore`).
- **Razón**: `MapCameraManager` necesita saber si un cambio de `selectedCoords` debe ser animado o no. Si el origen es 'map_click', será 'snap'. Si es 'list_click' o 'exploration', será 'flyTo'.

### 3. Duración de Animación Adaptativa

- **Decisión**: Duración base de 2000ms, ajustable según la distancia (opcional en fase 2).
- **Razón**: 2000ms proporciona una sensación cinematográfica sin ser demasiado lenta para el uso diario.

## Risks / Trade-offs

- **[Riesgo] Interferencia de Gestos**: Si el usuario intenta mover el mapa mientras la cámara está volando, puede haber "jank".
  - **Mitigación**: MapLibre cancela automáticamente la animación al detectar un gesto, pero debemos asegurar que nuestro estado interno refleje esto.
- **[Riesgo] Rendimiento en Android**: Android a veces sufre con animaciones largas si el estilo del mapa es pesado.
  - **Mitigación**: Usar `animationMode: 'flyTo'` nativo que está optimizado.
