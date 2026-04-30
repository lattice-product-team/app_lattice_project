## 1. UI: Botones Laterales y Fondo (Overlay & Dimmer)

- [x] 1.1 Implementar opacidad dinámica en `AdaptiveControlOverlay.tsx` basada en `islandState` (se vuelve 0 cuando `islandState > 0.5`).
- [x] 1.2 Asegurar que los botones no reciban eventos táctiles (`pointerEvents`) cuando la opacidad sea 0.
- [x] 1.3 Crear e implementar el componente `BackgroundDimmer` en `MapIndexPage` con opacidad vinculada a `islandState` (0 a 0.6 entre niveles 2 y 3).
- [x] 1.4 Modificar la opacidad de `DiscoveryDashboard.tsx` para ocultar filtros y carrusel cuando `islandState > 0.5`.

## 2. Lógica de Gestos y Snap Points (MapIndexPage)

- [x] 2.1 Modificar el `SNAP_POINTS` en `apps/mobile/app/(main)/index.tsx` para que el gesto manual (`onEnd`) solo reconozca `[0, 0.5]`.
- [x] 2.2 Implementar el retorno automático a 0.5 si el usuario intenta arrastrar manualmente por encima de este nivel.

## 3. Estética de Pantalla Completa (Nivel 3)

- [x] 3.1 Interpolar el ancho (`width`) de la Island para que pase de margen lateral (12) a 0 al llegar al Nivel 3.
- [x] 3.2 Interpolar el `borderRadius` y el `bottom` de la Island para un ajuste fluido a pantalla completa.
- [x] 3.3 Ajustar el `height` máximo para que cubra la pantalla respetando el `insets.top` (gap superior).

## 4. Transiciones Programáticas

- [x] 4.1 Configurar el trigger en `FloatingSearchBar` (onFocus) para llamar a `withSpring(1)`.
- [x] 4.2 Configurar el trigger en la selección de POIs/Eventos para llamar a `withSpring(1)`.
- [x] 4.3 Implementar botón de cierre o acción de retorno que devuelva la Island a `withSpring(0.5)`.
