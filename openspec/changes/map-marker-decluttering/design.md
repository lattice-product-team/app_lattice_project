## Context

Los marcadores en el mapa se renderizan mediante `MapLibreGL.MarkerView`. A diferencia de las capas de símbolos (`SymbolLayer`), `MarkerView` no tiene detección de colisiones nativa. Cuando múltiples POIs están vinculados a un Evento (o están en la misma ubicación), se amontonan, haciendo que las etiquetas sean ilegibles.

## Goals / Non-Goals

**Goals:**
- Implementar un mecanismo de "Spiderfication" (dispersión) para marcadores solapados.
- Optimizar la visibilidad de etiquetas según el nivel de zoom y estado de selección.
- Mantener el rendimiento del renderizado del mapa.

**Non-Goals:**
- Implementar clustering de estilo Mapbox (agrupación en círculos con números) para POIs de eventos, ya que el usuario prefiere ver los elementos individuales ("evento dentro tiene POIS").
- Cambiar la arquitectura de `MarkerView` a `SymbolLayer` (para no perder la fidelidad visual de los componentes React).

## Decisions

### 1. Algoritmo de Dispersión (Spiderfication)
Se utilizará una función de utilidad `applySpiderfication` que procese el GeoJSON antes de pasarlo a `MapLayers`.
- **Detección**: Agrupar features por coordenadas (con una tolerancia de ~0.0001 grados).
- **Patrón**: Si hay > 1 feature en un grupo y el zoom es alto (> 17), se aplica un desplazamiento polar:
  - Radio fijo (en píxeles o grados) que escale inversamente con el zoom para mantener la separación visual constante.
- **Rationale**: Es más sencillo que un motor de física completo y predecible para el usuario.

### 2. Visibilidad Contextual (Zoom & Selection)
- **Nivel de Zoom < 16**: Ocultar todos los POIs secundarios si no hay un evento seleccionado.
- **Nivel de Zoom 16-17**: Mostrar POIs como pequeños puntos/glifos sin etiquetas.
- **Nivel de Zoom > 17**: Activar etiquetas y aplicar spiderfication si es necesario.
- **Selección**: Si un Evento está seleccionado, sus POIs hijos siempre se muestran, independientemente del zoom global, pero sujetos a descolisión.

### 3. Z-Index Dinámico
Los `MarkerView` tendrán un `zIndex` basado en:
- `100` para POIs normales.
- `200` para Eventos.
- `500` para el elemento seleccionado (POI o Evento).

## Risks / Trade-offs

- **[Risk] Positional Inaccuracy** → Al desplazar el marcador, ya no apunta exactamente a la coordenada real. 
  - **Mitigation**: Dibujar una línea sutil ("leg") que conecte el marcador desplazado con el centro real cuando esté expandido, o limitar el desplazamiento a lo mínimo necesario.
- **[Risk] Jitter during Zoom** → La transición entre estado agrupado y disperso puede ser brusca.
  - **Mitigation**: Usar `react-native-reanimated` para animar la posición del marcador entre la real y la desplazada.
