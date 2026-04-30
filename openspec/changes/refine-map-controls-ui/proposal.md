## Why

Los controles actuales del mapa (HUD derecho) presentan problemas de usabilidad: son difíciles de pulsar debido a un área de interacción pequeña, tienen problemas de alineación visual y carecen de separadores que definan claramente cada acción. Este cambio busca alinear la estética con un estilo "Apple-style" más refinado y funcional.

## What Changes

- **Rediseño del HUD**: Transformación del `AdaptiveControlOverlay` en un panel vertical más integrado.
- **Mejora de Accesibilidad Táctil**: Aumento del área de pulsación de cada botón para facilitar su uso durante la navegación.
- **Alineación Visual**: Corrección de la alineación vertical de los iconos y etiquetas dentro del panel.
- **Separadores Visuales**: Inclusión de líneas horizontales tenues entre cada botón para delimitar claramente las áreas de interacción, siguiendo la referencia visual proporcionada.

## Capabilities

### Modified Capabilities
- `map-aesthetic-control`: Se actualizan los requisitos visuales y de interacción para los controles superpuestos del mapa.

## Impact

- `apps/mobile/src/features/map/components/AdaptiveControlOverlay.tsx`: Modificación completa del componente y sus estilos.
