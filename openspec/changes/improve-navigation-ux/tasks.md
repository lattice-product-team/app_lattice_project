## 1. Backend y Estados

- [x] 1.1 Extender `TransportMode` y añadir `isPlanning` en `useNavigationStore.ts`.
- [x] 1.2 Actualizar `navigationService.ts` para soportar el perfil `bicycle` de Valhalla.
- [x] 1.3 Refactorizar `formatDuration` en `NavigationInfo.tsx` para el nuevo formato "Xh Ymin".
- [x] 1.4 Eliminar rastro de modo `cycling` en Store y Service.
- [x] 1.5 Investigar y corregir el cálculo de tiempos idénticos entre caminar y coche.

## 2. Planificador de Ruta (Rediseño)

- [x] 2.1 Mover `RoutePlanningSheet` a una posición superior (Selector) y simplificar el botón de inicio abajo.
- [x] 2.2 Asegurar que la ruta se dibuja en el mapa tan pronto como se activa `isPlanning`.
- [x] 2.3 Implementar `fitBounds` en `MapCameraManager` para encuadrar origen y destino durante la planificación.

## 3. Aislamiento de UI y Centrado

- [x] 3.1 Implementar lógica de ocultación condicional para `FloatingSearchBar` y `AdaptiveControlOverlay` en `index.tsx`.
- [x] 3.2 Crear el componente `CenteringButton.tsx`.
- [x] 3.3 Integrar `CenteringButton` en `index.tsx` con lógica de visibilidad basada en `isNavigating` e `isFollowingUser`.

## 4. Mejoras Visuales del Mapa

- [x] 4.1 Actualizar `MapLibreGL.UserLocation` en `MapContent.tsx` para mostrar el indicador de heading.
- [x] 4.2 Verificar que el modo de cámara cambia a "course" durante la navegación activa en `MapCameraManager.tsx`.
