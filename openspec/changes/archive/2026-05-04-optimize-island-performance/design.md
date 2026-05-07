## Context

La implementación actual depende de un estado de React (`islandLevel`) actualizado en cada frame mediante `runOnJS`. Esto bloquea el hilo de JS y causa "jank" (lag visual).

## Goals / Non-Goals

**Goals:**

- Lograr 60fps constantes en todas las transiciones del bottom sheet.
- Eliminar re-renderizados de React durante el gesto de arrastre (Pan).
- Mantener la lógica de negocio (saber en qué nivel estamos) pero de forma asíncrona al renderizado.

**Non-Goals:**

- Cambiar la API de `DiscoveryDashboard`.
- Cambiar los snap points actuales.

## Decisions

### 1. Desacoplamiento de Hilos (UI vs JS)

Eliminaremos el `useDerivedValue` que llama a `runOnJS(setIslandLevel)`.
En su lugar:

- La lógica visual usará únicamente `islandState` (SharedValue).
- Si necesitamos que JS sepa el nivel final, usaremos el callback de `withSpring` o un listener de Reanimated que solo se dispare al asentarse la animación.

### 2. Contenido del Nivel 3 "Always On"

El contenido del Nivel 3 no se renderizará condicionalmente. Estará siempre en el árbol de componentes (o al menos mientras el sheet esté abierto), pero con `opacity: 0`.
Utilizaremos `Animated.View` para el contenedor de Nivel 3 con un estilo interpolado:

- `opacity`: `interpolate(islandState.value, [0.7, 0.9], [0, 1])`.

### 3. Optimización de ScrollView

El `ScrollView` de la Island puede causar problemas si se habilita/deshabilita constantemente. Mantendremos el scroll habilitado pero controlaremos su interactuabilidad mediante el estado de la animación.

## Risks / Trade-offs

- **[Riesgo]**: Mayor consumo de memoria por tener el contenido de Nivel 3 renderizado aunque sea invisible.
- **[Mitigación]**: El contenido de Nivel 3 suele ser texto e imágenes (que React Native optimiza bien cuando no son visibles). El beneficio en suavidad compensa este uso.
- **[Riesgo]**: Pérdida de sincronía en estados de JS que dependan del nivel.
- **[Mitigación]**: Actualizar el estado de JS solo al final de la transición.
