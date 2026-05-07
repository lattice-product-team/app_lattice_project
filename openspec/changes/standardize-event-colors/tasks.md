## 1. Ajustes en Utilidades y Adaptadores

- [x] 1.1 Modificar `apps/mobile/src/utils/poiUtils.ts` para unificar los colores en `EVENT_CATEGORY_MAP`.
- [x] 1.2 Asegurar que `normalizeEvent` en `poiAdapter.ts` use un color neutro o de marca consistente.

## 2. Refactorización de Componentes de Eventos

- [x] 2.1 Eliminar fondos dinámicos en `apps/mobile/src/features/map/components/EventCarousel.tsx`.
- [x] 2.2 Eliminar fondos dinámicos y colores de iconos en `apps/mobile/src/features/map/components/EventSummaryCard.tsx`.
- [x] 2.3 Revisar `EventCarouselCard.tsx` para asegurar que no se usen colores de categoría en las badges superiores.

## 3. Actualización de Capas del Mapa

- [x] 3.1 Modificar `apps/mobile/src/features/map/components/MapLayers.tsx` para forzar un color único en los pines de eventos (PointAnnotation).
- [x] 3.2 Validar que los POIs normales sigan manteniendo sus colores por categoría.
