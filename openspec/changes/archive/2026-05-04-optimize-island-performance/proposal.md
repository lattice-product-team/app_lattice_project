## Why

El bottom sheet actual experimenta caídas de frames (lag) durante las transiciones entre niveles. La causa raíz es la sincronización constante entre el hilo de UI (Reanimated) y el hilo de JS (React) mediante `runOnJS`, lo que provoca re-renderizados costosos en cada frame de la animación.

Este cambio busca alcanzar una fluidez de 60fps constantes moviendo toda la lógica visual al hilo de UI y minimizando la intervención de React durante las transiciones.

## What Changes

- **Eliminación de `runOnJS` para UI**: Se dejará de usar `setIslandLevel` para controlar la visibilidad de componentes durante la animación.
- **Opacidad sobre Layout**: Se reemplazará el uso de renderizado condicional (`{islandLevel > 0.7 && ...}`) y `display: 'none'` por interpolaciones de opacidad y `pointerEvents` controladas por Reanimated.
- **Contenido Superpuesto**: El contenido del Nivel 2 y Nivel 3 coexistirá en el árbol de componentes, pero su visibilidad se cruzará mediante opacidad ligada directamente a `islandState`.
- **Detección de Nivel Pasiva**: Solo se notificará a React del cambio de nivel al *finalizar* la animación (en el `onEnd` del gesto o vía `withSpring` callback) para lógica de negocio, no para renderizado.

## Capabilities

### New Capabilities
- `pure-ui-animation-bridge`: Implementación de una arquitectura donde el estado de la UI es manejado 100% por SharedValues de Reanimated sin puentes a JS durante el movimiento.

### Modified Capabilities
- `contextual-full-screen-detail`: Se optimiza la implementación estética para usar solo transformaciones de GPU.

## Impact

- `apps/mobile/app/(main)/index.tsx`: Reestructuración del árbol de componentes de la Island.
- `apps/mobile/src/features/map/components/DiscoveryDashboard.tsx`: Optimización de la lógica de visibilidad.
