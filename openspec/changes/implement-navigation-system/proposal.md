## Why

Lattice carece de un sistema integrado de navegación, obligando a los usuarios a salir de la aplicación para llegar a los eventos. Esto rompe la retención de usuarios y degrada la experiencia "premium" que buscamos. Implementar un sistema de navegación nativo basado en MapLibre permitirá a los usuarios descubrir cómo llegar a sus destinos (caminando o en coche) sin perder el contexto de la aplicación.

## What Changes

- **Motor de Rutas (Backend):** Integración de Valhalla como motor de cálculo de rutas en la infraestructura Docker.
- **Servicio de Navegación (Mobile):** Implementación de un cliente de rutas en la app móvil que soporte perfiles de 'driving' y 'pedestrian'.
- **UI de Previsualización:** Nueva interfaz en el `EventDetailSheet` para mostrar tiempo estimado, distancia y selección de modo de transporte.
- **Modo Navegación Activa (Active Navigation):** Interfaz inmersiva que se activa al iniciar la ruta:
    - **Capa Superior:** Banner con instrucciones de giro (flechas, distancia, nombre de calle) con estética glassmorphism oscura.
    - **Capa Inferior:** Panel de estado con tiempo de llegada, minutos y distancia restante.
    - **Cámara:** Seguimiento dinámico con inclinación (pitch) y rotación automática según la dirección de movimiento.
    - **Icono:** Reemplazo del marcador de posición por un "navigation puck" direccional.
- **Capa de Mapa:** Visualización dinámica de la ruta (polyline) sobre el mapa de MapLibre con estilos personalizados de Lattice.

## Capabilities

### New Capabilities
- `navigation-system`: Gestión de rutas, perfiles de transporte (pie/coche) e interfaz de navegación activa dentro de la aplicación móvil.

### Modified Capabilities
- `map-interface`: Requisitos añadidos para soportar capas de rutas dinámicas y estados de navegación.

## Impact

- **Mobile:** Nuevas dependencias (`ferrostar-react-native`, `expo-location`). Actualización de los componentes de mapa y hojas de detalle.
- **Server/Infra:** Adición de contenedor Valhalla en `docker-compose.yml` y configuración de descarga de datos OSM (OpenStreetMap) para la región de interés.
- **UX:** Cambio en el flujo de selección de eventos para incluir opciones de "Cómo llegar".
