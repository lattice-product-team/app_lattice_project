## 1. Arquitectura de Isla y Gestos

- [x] 1.1 Implementar `GestureDetector` (Pan) en `index.tsx` para el control manual de la isla.
- [x] 1.2 Programar la lógica de "Snapping" para los 3 puntos: 64px, 45% y 85%.
- [x] 1.3 Asegurar que `AdaptiveControlOverlay` siga la altura de la isla en los 3 estados de forma fluida.

## 2. Discovery Dashboard (Nivel 2 Rediseñado)

- [x] 2.1 Implementar `DiscoveryDashboard` con categorías (pills) arriba y carrusel abajo.
- [x] 2.2 Re-implementar filtros como tipos de eventos (Música, Gastro, etc.).
- [x] 2.3 Crear `EventCarouselCard` con diseño de superposición (Overlay) y rating.

## 3. Pulido y Transiciones

- [x] 3.1 Ajustar animaciones de snapping y feedback háptico.
- [x] 3.2 Verificar el renderizado de imágenes y gradientes en el carrusel.

## 4. Bug Fix: Event Carousel Squashing

- [x] 4.1 Eliminar `paddingBottom` y `minHeight` conflictivos en `DiscoveryDashboard.tsx`.
- [x] 4.2 Ajustar `height` de `carouselScrollContainer` para acomodar card + sombras (~350px).
- [x] 4.3 Definir altura explícita en `shadowWrapper` de `EventCarouselCard.tsx`.
- [ ] 4.4 Verificar alineación vertical del carrusel dentro de la isla (Nivel 2).
