## Why

Al acercarse a un evento que contiene múltiples puntos de interés (POIs), los marcadores y sus etiquetas se solapan visualmente, dificultando la lectura y la interacción. Esto ocurre porque todos los marcadores se renderizan en sus coordenadas exactas mediante `MarkerView` sin lógica de descolisión o agrupación.

## What Changes

- **Spiderfication Logic**: Implementar una utilidad que detecte marcadores con coordenadas idénticas o extremadamente cercanas y los desplace ligeramente en un patrón circular/espacial cuando el zoom es alto.
- **Label Descollision**: Ajustar los estilos de las etiquetas para evitar el solapamiento visual, o implementar una ocultación selectiva de etiquetas basada en la prioridad (Evento > POI).
- **Zoom-Based Visibility**: Refinar la lógica para que los POIs secundarios solo aparezcan a niveles de zoom muy altos o cuando su evento padre esté seleccionado, reduciendo el ruido visual global.
- **Marker Z-Index Management**: Asegurar que los marcadores seleccionados y los eventos principales siempre se rendericen por encima de los POIs secundarios.

## Capabilities

### New Capabilities

- `marker-spiderfication`: Capacidad para dispersar marcadores solapados en el mapa mediante algoritmos de compensación de coordenadas.
- `contextual-marker-filtering`: Lógica para filtrar y priorizar la visibilidad de marcadores basada en el estado de selección y nivel de zoom.

### Modified Capabilities

- `map-pin-components`: Actualizar los componentes de pin para soportar estados de descolisión y animaciones de dispersión.
- `spatial-hierarchy-logic`: Integrar la lógica de relación Evento-POI en el motor de renderizado del mapa para optimizar la densidad visual.

## Impact

- **Affected Code**: `MapLayers.tsx`, `EventMarker.tsx`, `POIMarker.tsx`, `mapPinStyles.ts`.
- **Dependencies**: Requiere lógica en `react-native-reanimated` para transiciones suaves durante la dispersión.
- **Performance**: El procesamiento de GeoJSON para descolisión debe ser eficiente para no impactar el frame rate durante el paneo del mapa.
