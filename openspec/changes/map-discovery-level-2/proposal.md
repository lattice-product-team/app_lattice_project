## Why

La interfaz actual del mapa es excelente en su estado minimalista, pero carece de una capa de "Descubrimiento" estructurada que ofrezca valor inmediato al usuario sin necesidad de realizar una búsqueda manual o expandir la lista al 100%. Necesitamos un "Nivel 2" (Altura Media) que actúe como un panel de control inteligente, ofreciendo atajos, filtros temporales y eventos destacados de forma fluida y profesional, siguiendo la estética de "Isla Creciente" de Apple Maps.

## What Changes

- **Lógica de Expansión en 3 Estados**: Implementar estados diferenciados para la isla: Compacto (Buscador), Descubrimiento (Altura Media, ~45%) y Completo (Expandido, ~85%).
- **Gesto de Arrastre Natural**: Añadir un `GestureDetector` para que la isla responda al tacto y se pueda "tirar" de ella hacia arriba de forma orgánica.
- **Filtros Temporales Integrados**: Re-introducir los chips de "Hoy", "Mañana", "Este finde" justo debajo del buscador cuando la isla está en Nivel 2.
- **Carrusel de Categorías Rápidas**: Implementar una fila de iconos circulares minimalistas para categorías de POI (Café, Restaurantes, Cultura, etc.).
- **Event Spotlight**: Una sección dedicada a mostrar el evento más relevante de forma visual dentro del panel medio.

## Capabilities

### New Capabilities

- `map-island-expansion`: Orquestación de los estados de altura y gestos de la cápsula flotante.
- `discovery-dashboard`: Componente contenedor para los widgets de nivel 2 (categorías, filtros).
- `event-spotlight`: Sistema de renderizado de tarjetas de evento optimizadas para la altura media.

### Modified Capabilities

- `map-interface`: Ajuste de la arquitectura base en `index.tsx` para soportar la expansión de contenido.

## Impact

- `apps/mobile/app/(main)/index.tsx`: Se convertirá en el orquestador principal de la isla.
- `apps/mobile/src/features/map/components/`: Nuevos componentes especializados para el contenido de descubrimiento.
- `AdaptiveControlOverlay.tsx`: Refinamiento de la sincronización con la altura variable.
