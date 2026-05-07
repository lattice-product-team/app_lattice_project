## Context

Actualmente, el sistema utiliza un mapa de categorías (`EVENT_CATEGORY_MAP`) que asigna colores específicos a cada tipo de evento (Música -> Azul, Comida -> Naranja, etc.). El usuario percibe esto como inconsistente y prefiere una estética donde los eventos sean visualmente uniformes, reservando la variedad cromática solo para los POIs (restaurantes, farmacias, etc.).

## Goals / Non-Goals

**Goals:**

- Unificar todos los eventos bajo un único color (Brand Primary o Rojo).
- Eliminar fondos de colores dinámicos en las tarjetas de eventos.
- Asegurar que los iconos sigan apareciendo pero con colores neutros (Blanco/Gris/Brand).

**Non-Goals:**

- Eliminar los colores de los POIs (puntos de interés permanentes).
- Cambiar la lógica de filtrado por categorías.

## Decisions

### 1. Centralización del color de eventos en `poiUtils.ts`

Se modificará `EVENT_CATEGORY_MAP` para que todas las entradas utilicen `colors.brand.primary` o un color neutro fijo.

### 2. Neutralización de Badges

En `EventCarousel.tsx` y `EventSummaryCard.tsx`, se sustituirán los fondos dinámicos:

- `backgroundColor: metadata.color` -> `backgroundColor: 'rgba(0,0,0,0.6)'` o similar.
- Los iconos pasarán a ser blancos o del color de marca.

### 3. Forzar color en `MapLayers.tsx`

Se ignorará la propiedad `color` proveniente del GeoJSON para la capa de eventos, forzando el uso de una constante global.

## Risks / Trade-offs

- **[Riesgo]** → Menor diferenciación visual rápida entre tipos de eventos en la lista.
- **[Mitigación]** → Se mantienen los iconos y las etiquetas de texto para la diferenciación semántica.
