## Context

La interfaz actual utiliza una "Island" personalizada que transiciona entre tres estados (0, 0.5, 1) representados por `islandState` (SharedValue). El Nivel 3 (valor 1) es accesible mediante scroll manual, lo cual se quiere restringir. Además, el diseño visual del Nivel 3 debe evolucionar a pantalla completa y ocultar controles redundantes (AdaptiveControlOverlay).

## Goals / Non-Goals

**Goals:**
- Restringir el gesto manual de arrastre para que el límite superior sea el Nivel 2 (0.5).
- Implementar transiciones programáticas al Nivel 3 (1.0) desde búsquedas o selección de POIs.
- Modificar el estilo del Nivel 3: Pantalla completa, sin márgenes laterales, con un gap superior.
- Ocultar los botones de `AdaptiveControlOverlay` cuando la Island sube hacia el Nivel 3.
- Asegurar un retorno progresivo al Nivel 2 al cerrar el Nivel 3.

**Non-Goals:**
- Cambiar la lógica interna de `DiscoveryDashboard`.
- Modificar el comportamiento de la cámara del mapa (fuera del scope inmediato).

## Decisions

### 1. Restricción de Snap Points en Gestos
Se modificará el `Gesture.Pan()` en `MapIndexPage` para que, en su fase `onEnd`, solo considere los snap points `[0, 0.5]` si el movimiento fue manual. 

### 2. Estética Dinámica (Interpolación)
Utilizaremos `islandStyle` y `islandBackground` en `MapIndexPage` para interpolar:
- **Width**: De `SCREEN_WIDTH - 24` (margen de 12 a cada lado) en Nivel 2, a `SCREEN_WIDTH` en Nivel 3.
- **BorderRadius**: Se mantendrá constante en `32` para preservar la identidad visual de la "Island" en todos los niveles.
- **Height**: El Nivel 3 tendrá una altura de aproximadamente el 80% de la pantalla para mantener una jerarquía visual clara de capas y evitar que se sienta como una pantalla completa.
- **Margins**: Desaparecerán en el Nivel 3 para el ancho total.

### 3. Efecto de Oscurecimiento de Fondo (Background Dimming)
Se añadirá una capa de fondo (`BackgroundDimmer`) entre el Mapa y la Island. Su opacidad estará vinculada a `islandState` mediante interpolación:
- `[0.5, 1.0]` -> `[0, 0.6]` (opacidad).
Esto proporcionará foco visual al contenido detallado y mejorará la legibilidad.

### 4. Visibilidad de Controles (Overlay & Dashboard)
- En `AdaptiveControlOverlay`, se añadirá una propiedad de `opacity` animada que reaccione al `islandState`. Cuando `islandState > 0.5`, la opacidad tenderá a 0.
- En `DiscoveryDashboard`, se modificará la interpolación de opacidad para que, al superar el valor 0.5 (Nivel 2), el contenido se desvanezca gradualmente hasta 0 al llegar a 0.6. Esto libera espacio para el contenido detallado del Nivel 3.

### 5. Transiciones Programáticas y Suavidad
- Se usarán configuraciones de spring con `damping: 25`, `stiffness: 120` para evitar rebotes excesivos pero mantener la naturalidad.
- **Retorno Dinámico**: Se almacenará el último nivel estable (0 o 0.5) antes de entrar al Nivel 3 vía buscador. Al perder el foco (blur), la Island regresará automáticamente a dicho nivel para mantener la continuidad del flujo del usuario.
- El retorno al Nivel 2 desde el 3 usará la misma configuración para consistencia.

## Risks / Trade-offs

- **[Riesgo]**: El bloqueo de gestos en 0.5 puede sentirse "brusco" si el usuario intenta seguir subiendo.
- **[Mitigación]**: Usar un ligero efecto de "resistencia" (rubber-banding) si `islandState > 0.5` aunque no se asiente ahí.
- **[Riesgo]**: Superposición con la StatusBar en Nivel 3.
- **[Mitigación]**: Usar `insets.top` para definir el gap superior exacto.
