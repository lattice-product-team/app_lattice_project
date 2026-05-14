## 1. Perfilado y Monitoreo (Android Focus)

- [ ] 1.1 Crear componente `PerformanceOverlay.tsx` para visualizar FPS y salud del JS thread.
- [ ] 1.2 Implementar detección de "frame drops" significativos durante transiciones.
- [ ] 1.3 Añadir toggle para el overlay en el menú de desarrollo de la app.

## 2. Optimización de Renderizado (Memoización)

- [ ] 2.1 Aplicar `React.memo` a los items de `DiscoveryFeed` para evitar re-renders durante el scroll.
- [ ] 2.2 Optimizar `AdaptiveControlOverlay` y botones HUD para que solo se actualicen cuando cambie su estado específico.
- [ ] 2.3 Refactorizar `FloatingSearchBar` para desacoplar su estado del progreso del mapa.

## 3. Refactorización de Reanimated y UI Thread

- [ ] 3.1 Migrar cálculos de estilo de `EventDetailSheet` íntegramente a `useAnimatedStyle`.
- [ ] 3.2 Implementar priorización de gestos en `premium-sheet-interaction` mediante configuraciones de spring optimizadas para Android.
- [ ] 3.3 Asegurar el uso de `opacity` y `transform` (GPU accelerated) en todas las transiciones críticas.

## 4. Carga Diferida y Gestión de Memoria

- [ ] 4.1 Implementar carga condicional (Lazy) de `MapContent` basado en la pestaña activa (`screenMode`).
- [ ] 4.2 Utilizar `InteractionManager.runAfterInteractions` para diferir el renderizado de listas pesadas tras animaciones de entrada.
- [ ] 4.3 Optimizar el pre-fetching de imágenes en `GalleryCarousel` para evitar picos de memoria en Android.
