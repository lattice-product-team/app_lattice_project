## 1. Infraestructura Persistente

- [ ] 1.1 Eliminar la renderización condicional `{selectedEvent && ...}` en `index.tsx`.
- [ ] 1.2 Asegurar que `EventDetailSheet` se renderice siempre, pasando `selectedEvent` (que puede ser null).

## 2. Reescritura del Motor de Animación

- [ ] 2.1 Implementar un `useEffect` o reacción en `EventDetailSheet` que dispare la animación basándose en si `event` es null o no.
- [ ] 2.2 Actualizar `islandStyle` para que el estado 0 signifique `-SCREEN_HEIGHT` (completamente fuera de la vista).
- [ ] 2.3 Implementar `useAnimatedProps` para cambiar `pointerEvents` a "none" cuando el panel esté escondido.
- [ ] 2.4 Unificar físicas usando `theme.motion.physics`.

## 3. Refactorización de Gestos

- [ ] 3.1 Implementar `Gesture.Simultaneous` vinculando el gesto de arrastre con el scroll nativo.
- [ ] 3.2 Ajustar los puntos de snap para que coincidan con la inercia del buscador principal.

## 4. Verificación de Estabilidad

- [ ] 4.1 Confirmar que el cierre rápido ya no lanza advertencias de `onAnimatedValueUpdate`.
- [ ] 4.2 Verificar que la cámara se mueve correctamente al seleccionar eventos desde el carrusel (Nivel 2).
