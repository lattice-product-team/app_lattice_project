## 1. Infraestructura de Estado (Store)

- [x] 1.1 Actualizar `useMapUIStore` para incluir `triggerSource` ('map_click', 'list_click', 'exploration') en la acción de selección de POI/Eventos.
- [x] 1.2 Asegurar que el estado por defecto del `triggerSource` sea neutral para evitar animaciones no deseadas en el primer renderizado.

## 2. Núcleo de Animación (MapCameraManager)

- [x] 2.1 Implementar el método `flyTo` en `MapCameraHandle` que expone la interfaz imperativa.
- [x] 2.2 Configurar la lógica de `setCamera` con `animationMode: 'flyTo'`, `animationDuration: 2000` y curvas de easing optimizadas.
- [x] 2.3 Añadir un `useEffect` que escuche cambios en `selectedCoords` Y `triggerSource` para disparar `flyTo` solo cuando el origen sea UI/Exploración.

## 3. Integración en UI y Componentes

- [x] 3.1 Modificar `DiscoveryDashboard` para que al seleccionar un evento se envíe el `triggerSource: 'exploration'`.
- [x] 3.2 Actualizar `POICarousel` y `EventCarousel` para emitir `triggerSource: 'list_click'`.
- [x] 3.3 Verificar que el `MapContent` pase correctamente el nuevo estado al `MapCameraManager`.

## 4. Validación y Ajustes

- [x] 4.1 Validar la fluidez de la animación en iOS (Simulador/Dispositivo).
- [x] 4.2 Validar la paridad de comportamiento en Android.
- [x] 4.3 Verificar que los toques directos en el mapa sigan realizando un "snap" o cambio instantáneo sin vuelo parabólico.
