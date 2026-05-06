## Why

El uso de colores variados por categoría en los elementos de eventos (pines, tarjetas de carrusel y hojas de detalles) genera una carga visual excesiva y fragmenta la identidad de marca de la aplicación. El usuario desea mantener la categorización por colores únicamente en los puntos de interés (POIs) estándar del mapa, unificando la estética de todos los eventos bajo un esquema de color neutro o corporativo.

## What Changes

- **Unificación de Pines de Eventos**: Ajuste de `MapLayers` y los adaptadores de datos para que todos los eventos utilicen un único color distintivo (ej. Rojo Lattice o Brand Primary) independientemente de su categoría.
- **Neutralización de Componentes de Carrusel**: Eliminación de fondos coloreados en badges y etiquetas dentro de `EventCarousel`, `EventCarouselCard` y `DiscoveryDashboard`.
- **Limpieza de Hojas de Detalles**: Refactorización de `EventDetailSheet` y `EventSummaryCard` para eliminar acentos de color basados en categorías (música, deporte, etc.).
- **Ajuste de Utilidades**: Modificación de `getEventMetadata` para que devuelva un color neutro o corporativo por defecto para todas las categorías de eventos.

## Capabilities

### New Capabilities
- `unified-event-branding`: Define el estándar visual para todos los elementos de eventos en la plataforma, eliminando variaciones cromáticas por categoría.

### Modified Capabilities
- `event-detail-sheet`: Se ajusta la especificación para reflejar el uso de colores neutros/brand en lugar de dinámicos.
- `map-pin-components`: Se especifica que los pines de eventos DEBEN ser cromáticamente uniformes.

## Impact

- `apps/mobile/src/utils/poiUtils.ts`: Cambio en `EVENT_CATEGORY_MAP`.
- `apps/mobile/src/features/map/components/EventCarousel.tsx`, `EventSummaryCard.tsx`: Eliminación de `metadata.color`.
- `apps/mobile/src/features/map/components/MapLayers.tsx`: Forzar color único en pines de eventos.
