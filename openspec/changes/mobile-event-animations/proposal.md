## Why

Para conseguir una sensación verdaderamente "premium" y nativa, la interacción entre la selección de eventos y el mapa debe sentirse orgánica. Actualmente, la transición espacial al seleccionar un evento no proporciona el "feedback" direccional de navegación esperado. Implementar un "vuelo" de cámara fluido (fly-to) estilo Apple Maps hacia la ubicación del evento seleccionado —tanto al tocar un pin en el mapa como al tocar una tarjeta en la lista del desplegable— es clave para elevar la experiencia de descubrimiento y ofrecer una interfaz del más alto nivel.

## What Changes

- **Integración de Cámara Fluida (Fly-to):** Cuando se selecciona un evento (tocando su pin en el mapa o su tarjeta en la lista/desplegable), el mapa realizará un vuelo de cámara suave, posiblemente ajustando el zoom y la inclinación para enfocar el evento.
- **Sensación "Apple Maps":** La interpolación del movimiento buscará imitar la fluidez de Apple Maps, asegurando que la cámara llegue a su destino con el pin perfectamente enmarcado, considerando que el "sheet" tapará la parte inferior de la pantalla.
- **Sin Cambios en UI Existente:** Los pines no tendrán animaciones adicionales de rebote (ya están bien) y el desplegable de detalles funcionará como lo hace actualmente. El enfoque es estrictamente sincronizar el mapa visualmente con la selección.

## Capabilities

### New Capabilities

- `fluid-map-camera-flyto`: Capacidad para gestionar las transiciones de cámara fluidas e interpoladas del mapa al seleccionar coordenadas de puntos de interés y eventos, controlando offsets de la interfaz.

### Modified Capabilities

- `map-discovery-platform`: Se debe actualizar para que la selección de un evento invoque imperativamente o reactivamente el nuevo vuelo de la cámara hacia el destino.
- `map-pin-components`: Asegurar que el evento _onPress_ de los pines del mapa dispare el mismo evento de selección centralizado.

## Impact

- **Código:** Componentes del mapa móvil (específicamente la referencia al `<Camera>` de Mapbox en React Native) y los handlers que conectan la lista con el mapa.
- **Performance:** Al delegarse la animación de la cámara al motor nativo (GL) del mapa, se mantendrá un rendimiento óptimo de 60fps.
