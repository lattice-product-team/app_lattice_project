## 1. Limpieza de Puentes JS (MapIndexPage)

- [x] 1.1 Eliminar el `useDerivedValue` que llama a `runOnJS(setIslandLevel)`.
- [x] 1.2 Migrar el estado `islandLevel` a un SharedValue o usar directamente `islandState.value` en los componentes que lo necesiten.
- [x] 1.3 Actualizar `setPreSearchLevel` para que solo se llame al finalizar la animación o mediante un disparador manual, no en cada frame.

## 2. Optimización de Capas de Contenido

- [x] 2.1 Refactorizar el renderizado condicional de Nivel 3 para que sea un componente persistente con opacidad animada.
- [x] 2.2 Implementar `pointerEvents` dinámicos en los contenedores de Nivel 2 y 3 basados en `islandState`.
- [x] 2.3 Ajustar el `ScrollView` para que sus propiedades `enabled` y `bounces` no fuercen re-renderizados constantes (usar estilos animados si es posible o actualizar solo en estados estables).

## 3. Verificación de Fluidez

- [x] 3.1 Probar la transición manual (Pan) y verificar la ausencia de "jank".
- [x] 3.2 Verificar que la transición programática (al buscar o seleccionar POI) es instantánea y fluida.
