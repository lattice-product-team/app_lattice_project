## 1. Refactorización de MapIndexPage (Buscador Principal)

- [x] 1.1 Actualizar `SPRING_CONFIG` con los nuevos valores premium (damping: 35, stiffness: 120).
- [x] 1.2 Implementar cálculo dinámico del divisor de gestos basado en `SCREEN_HEIGHT` y la altura del panel.
- [x] 1.3 Ajustar el factor de inercia en `onEnd` a `0.03`.
- [x] 1.4 Verificar el seguimiento 1:1 en el gesto de arrastre.

## 2. Refactorización de EventDetailSheet

- [x] 2.1 Sincronizar `SPRING_CONFIG` con el buscador principal.
- [x] 2.2 Corregir el divisor de gestos de `300` a un cálculo dinámico proporcional a la altura del panel.
- [x] 2.3 Ajustar el factor de inercia en `onEnd` a `0.03`.
- [x] 2.4 Eliminar el clamping excesivo (`1.2`) para evitar rebotes violentos.

## 3. Unificación y Pulido

- [x] 3.1 Revisar `POIMiniCard` y aplicar la misma configuración de muelle para coherencia visual.
- [x] 3.2 Verificar que el gesto de "drag-down" desde el Nivel 3 (scroll al inicio) funciona correctamente con la nueva física.
- [x] 3.3 Validar que no se saltan niveles accidentales en ninguno de los componentes.
