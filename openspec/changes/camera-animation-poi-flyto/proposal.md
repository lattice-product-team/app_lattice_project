## Why

Actualmente, el cambio de enfoque de la cámara al seleccionar un Punto de Interés (POI) o un evento desde la interfaz de usuario (desplegables, carruseles o modo exploración) es instantáneo o inexistente ("snap"). Esto genera una experiencia de usuario brusca y desorientadora.

Se requiere un sistema de animaciones de cámara ("FlyTo") que proporcione transiciones suaves y cinemáticas, mejorando la percepción de continuidad espacial tanto en iOS como en Android, asegurando que el usuario entienda el desplazamiento desde su posición actual hasta el destino seleccionado.

## What Changes

- **Sistema de Animación FlyTo**: Implementación de una lógica de transición suave (cinemática) en `MapCameraManager` que reemplace o complemente el actual "snap".
- **Intercepción de Eventos de Selección**: Modificación de los disparadores de selección de POIs y eventos para activar la animación solo cuando la selección provenga de elementos de exploración/desplegables (no por toques directos en el mapa para evitar redundancia).
- **Control de Curva de Animación**: Configuración de duraciones y curvas de interpolación (easing) optimizadas para dispositivos móviles para evitar "lag" visual.
- **Sincronización de Estado**: Asegurar que el estado de la cámara se sincronice correctamente durante y después de la animación para evitar saltos o conflictos con gestos del usuario.

## Capabilities

### New Capabilities

- `camera-flyto-system`: Orquestación de animaciones cinemáticas entre coordenadas geográficas con soporte para control de zoom y pitch dinámico.

### Modified Capabilities

- `event-poi-orchestration`: Actualización de la lógica de enfoque para disparar animaciones suaves al seleccionar elementos desde la UI de exploración.
- `pure-ui-animation-bridge`: Integración de las animaciones de mapa con el puente de animaciones existente para mantener coherencia visual.

## Impact

- **Componentes**: `MapCameraManager`, `MapContent`, `DiscoveryDashboard`, `POICarousel`, `EventCarousel`.
- **Hooks/Store**: `useMapUIStore` (posible necesidad de nuevos estados para rastrear el progreso de la animación).
- **Plataformas**: Asegurar paridad de rendimiento en iOS y Android usando las capacidades nativas de `MapLibreGL`.
