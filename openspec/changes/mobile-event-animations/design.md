## Context

Actualmente en Lattice Mobile, cuando un usuario selecciona un evento —ya sea tocando su pin en el mapa o a través de una tarjeta en la lista desplegable inferior—, el sistema abre la vista de detalles pero el mapa no proporciona retroalimentación de navegación espacial. La propuesta actual dicta que debemos imitar el comportamiento de Apple Maps, realizando un movimiento suave de cámara (fly-to) hacia la ubicación del evento seleccionado, manteniendo el pin centrado y visible por encima de la hoja de detalles sin añadir animaciones redundantes (como rebotes) a los pines ni alterar el comportamiento de la hoja (sheet).

## Goals / Non-Goals

**Goals:**

- Implementar una animación nativa de cámara (fly-to) en la referencia del mapa (`Camera` de Mapbox).
- Sincronizar la selección del evento en el contexto global para disparar la animación de la cámara independientemente del origen de la selección (tap en el pin o tap en la lista).
- Mantener la máxima fluidez delegando la transición al motor GL de Mapbox.

**Non-Goals:**

- Modificar las animaciones de la UI en la hoja de detalles (BottomSheet).
- Cambiar la apariencia o animación individual de los pines en el mapa.
- Alterar la lógica base de recuperación de datos de eventos o el modelo de estado de POIs.

## Decisions

1. **Uso de Mapbox Camera Actions**
   - _Alternativa considerada:_ Interpolar manualmente las coordenadas del centro del mapa usando _Reanimated_.
   - _Decisión:_ Utilizar los métodos imperativos del componente `<Camera>` de `@rnmapbox/maps` (como `setCamera({ animationDuration, animationMode: 'flyTo', centerCoordinate, ... })`).
   - _Razón:_ Mapbox cuenta con la implementación nativa y matemáticamente correcta (interpolación esférica, manejo de pitch/zoom) para este movimiento, garantizando la fluidez buscada sin sobrecargar el hilo de JS.

2. **Cálculo de Offset (Map Padding)**
   - _Decisión:_ La cámara no centrará el pin geométricamente en el medio de la pantalla, sino que emplearemos la propiedad de padding/offset de Mapbox o un cálculo aritmético para desplazar el centro visual.
   - _Razón:_ Al mostrar la tarjeta de detalles en el BottomSheet (que suele cubrir la mitad inferior de la pantalla), un centrado absoluto dejaría el pin oculto bajo la hoja. El pin debe estar visible en la "mitad superior visible" imitando a Apple Maps.

3. **Arquitectura Reactiva para Disparar el Vuelo**
   - _Decisión:_ Utilizar un `useEffect` en el componente contenedor del mapa que observe el estado `selectedEvent` (o similar de Zustand/Context) y tenga acceso a la referencia de la `<Camera>`.
   - _Razón:_ Mantiene los componentes desacoplados. La lista simplemente actualiza el `selectedEvent`, y el componente del Mapa reacciona a ese cambio orquestando la cámara de forma imperativa.

## Risks / Trade-offs

- **[Risk] La animación del mapa compite en recursos con la expansión simultánea del BottomSheet.**
  - _Mitigation:_ Ambas corren en hilos separados (GL/C++ para Mapbox, UI Thread a través de Reanimated para el BottomSheet), por lo que la competición es mínima.
- **[Risk] Interrupción gestual por parte del usuario.**
  - _Mitigation:_ Mapbox cancela automáticamente la animación `flyTo` si detecta gestos del usuario (pan, zoom). Mantendremos este comportamiento estándar.
