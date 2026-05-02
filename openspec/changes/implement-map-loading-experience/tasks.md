## 1. Lógica Base y Pre-carga

- [x] 1.1 Exponer la función `prewarmMapStyles` desde el hook `useMapStyle` para permitir carga fuera de componente.
- [x] 1.2 Integrar la llamada a `prewarmMapStyles` en el arranque de la aplicación (Root Layout) para anticipar la carga.
- [x] 1.3 Implementar el estado local `isMapReady` en `MapContent.tsx` y vincularlo al evento `onDidFinishLoadingMap`.

## 2. Componentes de Interfaz

- [x] 2.1 Crear el componente `MapLoadingOverlay.tsx` en `src/features/map/components/`.
- [x] 2.2 Implementar el diseño visual: gradiente Midnight, blur de fondo y animación de pulso/branding.
- [x] 2.3 Asegurar la compatibilidad total con el sistema de temas (Light/Dark mode) de Lattice.

## 3. Orquestación y Transiciones

- [x] 3.1 Integrar `MapLoadingOverlay` dentro de `MapContent.tsx` condicionado al estado `isMapReady`.
- [x] 3.2 Implementar la lógica de transición suave (fade-out y zoom-out) usando `react-native-reanimated`.
- [x] 3.3 Añadir un timeout de seguridad de 5 segundos para revelar el mapa en caso de fallo de red persistente.

## 4. Verificación y Pulido

- [ ] 4.1 Validar el comportamiento visual simulando una red lenta (Throttling).
- [ ] 4.2 Comprobar que no hay saltos de cámara bruscos una vez que el overlay desaparece.
- [ ] 4.3 Verificar que el overlay bloquea correctamente la interacción con el mapa hasta su desaparición completa.

## 5. Optimización de Cámara y Render (Fix Salto Azul)

- [x] 5.1 Ajustar `defaultSettings` de la cámara para usar `userCoords` en lugar de `MAP_CENTER`.
- [x] 5.2 Implementar `onMapIdle` para capturar el estado real de renderizado (Tiles listos).
- [x] 5.3 Sincronizar el `backgroundColor` del `MapView` con el tema de la app.

## 6. Unificación de Loading (AppLoadingView)

- [x] 6.1 Crear el componente `src/components/ui/AppLoadingView.tsx` (Spinner amarillo + Fondo Tema).
- [x] 6.2 Refactorizar `app/index.tsx` para usar `AppLoadingView`.
- [x] 6.3 Refactorizar `MapLoadingOverlay.tsx` para usar `AppLoadingView` como base.
- [x] 6.4 Asegurar que la transición sea fluida entre la pantalla de entrada y el mapa (Cobertura Total).
