## Why

La aplicación Lattice muestra un rendimiento excelente en iOS, pero presenta un lag significativo en dispositivos Android (especialmente modelos antiguos). Los tiempos de respuesta en botones, desplegables e interacciones de mapas son elevados, lo que degrada la experiencia de usuario y la percepción de calidad "premium" del producto.

## What Changes

- **Optimización de Renderizado**: Implementación de `React.memo` y `useCallback` en componentes críticos del Dashboard y el Mapa para evitar re-renders innecesarios.
- **Refactorización de Reanimated**: Optimización de interpolaciones y uso de `useDerivedValue` para reducir la carga en el hilo de la UI en Android.
- **Lazy Loading**: Diferir la carga de componentes pesados del Mapa y la Galería hasta que sean estrictamente necesarios.
- **Consolidación de Estilos**: Reducir el uso de estilos dinámicos calculados en tiempo de ejecución de JS que bloquean el puente (bridge) en Android.
- **Revisión de New Architecture**: Evaluar el impacto de Fabric/TurboModules en dispositivos antiguos y ajustar configuraciones si es necesario.

## Capabilities

### New Capabilities
- `android-performance-profiling`: Implementación de herramientas de monitoreo de FPS y JS Thread para validación en tiempo real durante el desarrollo.

### Modified Capabilities
- `premium-sheet-interaction`: Mejora de la fluidez en el despliegue de las hojas de detalles (`EventDetailSheet`) en Android.
- `pure-ui-animation-bridge`: Ajustes específicos para Android para evitar el "bottleneck" del JS thread durante animaciones complejas en el `MapIndexPage`.

## Impact

Afecta principalmente a `apps/mobile`, específicamente a las vistas de Mapa (`MapIndexPage`), Explore (`DiscoveryFeed`) y los componentes de UI compartidos (`src/components/ui`). No hay cambios esperados en la API ni en el Admin Web.
