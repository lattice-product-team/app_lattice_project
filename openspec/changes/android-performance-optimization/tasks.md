## 1. Perfilado y Monitoreo (Android Focus)

- [x] 1.1 Crear componente `PerformanceOverlay.tsx` (Eliminado por petición del usuario).
- [x] 1.2 Implementar detección de "frame drops" (Eliminado por petición del usuario).
- [x] 1.3 Añadir toggle para el overlay (Eliminado por petición del usuario).

## 2. Optimización de Renderizado (Memoización)

- [x] 2.1 Aplicar `React.memo` a los items de `DiscoveryFeed` para evitar re-renders durante el scroll.
- [x] 2.2 Optimizar `AdaptiveControlOverlay` y botones HUD para que solo se actualicen cuando cambie su estado específico.
- [x] 2.3 Refactorizar `FloatingSearchBar` para desacoplar su estado del progreso del mapa.

## 3. Refactorización de Reanimated y UI Thread

- [x] 3.1 Migrar cálculos de estilo de `EventDetailSheet` íntegramente a `useAnimatedStyle`.
- [x] 3.2 Implementar priorización de gestos en `premium-sheet-interaction` mediante configuraciones de spring optimizadas para Android.
- [x] 3.3 Asegurar el uso de `opacity` y `transform` (GPU accelerated) en todas las transiciones críticas.

## 4. Carga Diferida y Gestión de Memoria

- [x] 4.1 Implementar carga condicional (Lazy) de `MapContent` basado en la pestaña activa (`screenMode`).
- [x] 4.2 Utilizar `InteractionManager.runAfterInteractions` para diferir el renderizado de listas pesadas tras animaciones de entrada.
- [x] 4.3 Optimizar el pre-fetching de imágenes en `GalleryCarousel` para evitar picos de memoria en Android.
