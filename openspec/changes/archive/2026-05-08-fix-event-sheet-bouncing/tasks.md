## 1. Configuración de Físicas

- [x] 1.1 Definir `sheetSpring` con `damping: 20` y `stiffness: 90` en `EventDetailSheet.tsx`.
- [x] 1.2 Reemplazar el uso de `liquidSpring` por la nueva configuración `sheetSpring`.

## 2. Sincronización Protegida

- [x] 2.1 Modificar la `useAnimatedReaction` de `externalState` para que solo actúe si `islandState.value < 0.1`.
- [x] 2.2 Asegurar que la reacción ignore cambios si el panel ya está en posición `FULL` (1.0).

## 3. Cierre Orquestado

- [x] 3.1 Implementar función `animateClose` interna que ejecute `withSpring(0)` y llame a `onClose` al terminar.
- [x] 3.2 Actualizar el botón de cerrar ("X") para usar `animateClose`.
- [x] 3.3 Ajustar el gesto de arrastre (`PanGesture`) para que al detectar cierre use la misma lógica de callback.

## 4. Verificación y Pulido

- [x] 4.1 Comprobar que el panel se mantiene en Nivel 2 sin rebotar.
- [x] 4.2 Verificar que el cierre es suave y completa la animación antes de que React limpie el evento.
