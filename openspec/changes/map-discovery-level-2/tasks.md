## 1. Arquitectura de Isla y Gestos

- [ ] 1.1 Implementar `GestureDetector` (Pan) en `index.tsx` para el control manual de la isla.
- [ ] 1.2 Programar la lógica de "Snapping" para los 3 puntos: 64px, 45% y 85%.
- [ ] 1.3 Asegurar que `AdaptiveControlOverlay` siga la altura de la isla en los 3 estados de forma fluida.

## 2. Discovery Dashboard (Nivel 2)

- [ ] 2.1 Crear el componente `DiscoveryDashboard` con animaciones de entrada (`fade-in`).
- [ ] 2.2 Integrar los chips de filtros temporales (Hoy, Mañana, Este finde) bajo el buscador.
- [ ] 2.3 Implementar el carrusel de categorías rápidas (Iconos + Texto) para POIs.

## 3. Event Spotlight

- [ ] 3.1 Crear el componente `EventSpotlightCard` optimizado para la altura media.
- [ ] 3.2 Conectar el componente con el `useEventStore` para mostrar el evento destacado actual.

## 4. Pulido y Transiciones

- [ ] 4.1 Ajustar las constantes de `withSpring` para que el rebote se sienta idéntico a iOS.
- [ ] 4.2 Añadir feedback háptico (`impactAsync`) al cruzar cada punto de anclaje.
