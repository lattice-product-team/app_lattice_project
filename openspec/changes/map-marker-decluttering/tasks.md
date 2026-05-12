## 1. Utilidades y Preparación

- [x] 1.1 Crear `spatialUtils.ts` con la lógica de spiderfication (detección de colisiones y cálculo de offsets).
- [x] 1.2 Actualizar `MapLayersProps` para incluir `zoomLevel`.
- [x] 1.3 Pasar `currentZoom` desde `MapContent` a `MapLayers`.

## 2. Lógica de Renderizado en MapLayers

- [x] 2.1 Aplicar spiderfication a `eventsGeoJSON` y `poisGeoJSON` antes del mapeo de componentes.
- [x] 2.2 Implementar filtrado dinámico: ocultar POIs si `zoom < 16.5` y no están seleccionados.
- [x] 2.3 Implementar gestión de `zIndex` (Eventos > POIs, Seleccionado > Resto).

## 3. Actualización de Componentes de Marcador

- [x] 3.1 Actualizar `POIMarker` para ocultar `labelBadge` si `zoom < 17` (a menos que esté seleccionado).
- [x] 3.2 Asegurar que `EventMarker` siempre muestre su etiqueta o tenga prioridad visual.
- [x] 3.3 Añadir soporte para animar el cambio de posición (de real a spider-offset).

## 4. Pulido Visual

- [ ] 4.1 Ajustar radios de dispersión para que se sientan naturales.
- [ ] 4.2 (Opcional) Dibujar líneas de conexión entre el punto original y el marcador desplazado si hay solapamiento crítico.
