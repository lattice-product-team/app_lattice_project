## 1. Núcleo de Cámara (MapCameraManager)

- [x] 1.1 Implementar el `useEffect` que detecta el inicio de `isPlanning` para disparar el FlyTo al usuario (Zoom 17, Pitch 45).
- [x] 1.2 Configurar el componente `<MapLibreGL.Camera>` para que use dinámicamente `followUserMode` basándose en el `cameraMode` del store.
- [x] 1.3 Asegurar que el cambio a `FOLLOW_WITH_HEADING` active el `pitch` automático.

## 2. Orquestación de Gestos (MapContent)

- [x] 2.1 Refinar `handleCameraChange` para que, al detectar `isUserInteraction`, cambie el `cameraMode` a `FREE` de forma limpia.
- [x] 2.2 Verificar que el flag `isProgrammaticMove` bloquee correctamente la ruptura del seguimiento durante las animaciones automáticas.

## 3. UI y Control (AdaptiveControlOverlay)

- [x] 3.1 Actualizar el botón de `Recenter` para que en modo navegación ponga el estado en `FOLLOW_WITH_HEADING`.
- [x] 3.2 Añadir feedback visual al botón de centrado cuando el modo de seguimiento está activo.

## 4. Validación

- [x] 4.1 Probar el flujo completo: Ticket -> GO -> FlyTo Usuario -> Navegación iniciada con seguimiento.
- [x] 4.2 Validar que el gesto manual detiene el seguimiento.
- [x] 4.3 Validar que el botón de recenter restaura el seguimiento con heading.
