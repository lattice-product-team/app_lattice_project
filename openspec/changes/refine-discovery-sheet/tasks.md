## 1. Contenido y UI (Nivel 3)

- [x] 1.1 Actualizar la lógica en `index.tsx` para mostrar `SearchExperience` en Nivel 3 por defecto
- [x] 1.2 Eliminar el placeholder antiguo de "Selecciona un punto"
- [x] 1.3 Ajustar márgenes y padding para que la transición al Nivel 3 sea limpia

## 2. Física y Gestos

- [x] 2.1 Refactorizar la configuración de `withSpring` a valores Premium (`damping: 35, stiffness: 80`)
- [x] 2.2 Implementar valor compartido `isScrollAtTop` mediante el evento `onScroll` del ScrollView
- [x] 2.3 Sincronizar el gesto de arrastre para permitir el cierre desde cualquier punto en Nivel 3
- [x] 2.4 Corregir la sensibilidad excesiva en el `onUpdate` del gesto Pan

## 3. Rendimiento y Pulido

- [x] 3.1 Optimizar las interpolaciones de color para evitar caídas de frames
- [x] 3.2 Asegurar el uso de `Extrapolation.CLAMP` en todas las animaciones críticas
- [x] 3.3 Verificar la fluidez total de las transiciones entre niveles
