## Context

Actualmente, los gestos de los paneles en `MapIndexPage` y `EventDetailSheet` utilizan divisores fijos (ej. 390 o 300) para mapear la traslación en píxeles al estado compartido (`SharedValue`). Esto genera una desincronía donde el panel se mueve más rápido que el dedo. Además, la sensibilidad a la velocidad es demasiado alta, provocando saltos de nivel accidentales.

## Goals / Non-Goals

**Goals:**

- Lograr un seguimiento 1:1 entre el dedo del usuario y el panel.
- Unificar la física de muelle (`SPRING_CONFIG`) para una sensación de peso y suavidad consistente.
- Reducir la sensibilidad a la velocidad para favorecer el anclaje al nivel más cercano.

**Non-Goals:**

- Cambiar la estructura visual de los paneles.
- Modificar la lógica de negocio o el contenido de los paneles.
- Implementar nuevos estados de navegación.

## Decisions

### 1. Cálculo Dinámico del Divisor de Gestos

**Decisión**: Utilizar la distancia física real entre los puntos de anclaje (Snap Points) para calcular el `stateDelta`.
**Racional**: Para que el movimiento sea 1:1, el divisor debe ser exactamente la diferencia en píxeles que representa un cambio de `1.0` en el estado.

- Para `MapIndexPage`: `DIVISOR = (SCREEN_HEIGHT * 0.80) - 60` (aproximadamente 600-700px dependiendo del dispositivo).
- Para `EventDetailSheet`: `DIVISOR = (SCREEN_HEIGHT * 0.80) - (insets.bottom + 5)`.

### 2. Estandarización de `SPRING_CONFIG`

**Decisión**: Adoptar una configuración de muelle más amortiguada y con mayor "fuerza" de atracción (magnetismo).

```typescript
const PREMIUM_SPRING_CONFIG = {
  damping: 38,
  stiffness: 170,
  mass: 1.0,
  overshootClamping: true,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 2,
};
```

**Racional**: Aumentar `stiffness` a 170 permite que el panel se sienta más atraído por los puntos de anclaje ("efecto imán"), mientras que un `damping` de 38 asegura que el movimiento siga siendo suave y premium sin rebotes.

### 3. Ajuste de Inercia en `onEnd`

**Decisión**: Reducir drásticamente el multiplicador de velocidad de `0.03` a `0.01`.
**Racional**: Al bajar a `0.01`, la posición proyectada dependerá casi exclusivamente de la posición actual del panel, haciendo que sea muy difícil saltarse un nivel accidentalmente mediante un "flick". El panel se sentirá "pegado" al nivel actual a menos que el movimiento sea muy amplio.

## Risks / Trade-offs

- **[Riesgo]** → Los cambios en la física pueden sentirse "lentos" para usuarios acostumbrados a la hipersensibilidad actual.
- **[Mitigación]** → El seguimiento 1:1 compensa esta sensación al dar mayor percepción de control y precisión.
- **[Riesgo]** → Diferentes tamaños de pantalla pueden variar ligeramente la sensación.
- **[Mitigación]** → El uso de `SCREEN_HEIGHT` y `useSafeAreaInsets` en los cálculos asegura la proporcionalidad.
