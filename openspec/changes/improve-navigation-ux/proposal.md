## Why

El sistema de navegación actual es funcional pero carece de la fluidez y el control esperados en una aplicación premium. Actualmente, la navegación se inicia sin permitir al usuario elegir su medio de transporte, la interfaz se siente congestionada durante la conducción y la gestión del centrado del mapa tras una exploración manual es inexistente.

## What Changes

- **Planificador de Ruta (Route Planner)**: Introducción de un paso intermedio antes de iniciar la navegación para seleccionar el modo de transporte (Coche, Caminar, Bicicleta).
- **Modo Conducción Aislado**: Ocultación dinámica de elementos de UI no esenciales (barra de búsqueda, controles adaptativos) durante la navegación activa para maximizar la visibilidad del mapa.
- **Botón de Recentrado Inteligente**: Aparece dinámicamente cuando el usuario desplaza el mapa manualmente durante una ruta, permitiendo volver al modo de seguimiento con un solo toque.
- **Puntero de Dirección (Heading Indicator)**: Mejora visual del puntero de usuario para indicar la orientación real (brújula) del dispositivo.
- **Formato de Tiempo Mejorado**: Ajuste de las etiquetas de duración para mostrar horas y minutos cuando el trayecto supera los 60 minutos.

## Capabilities

### New Capabilities
- `route-planner`: Interfaz y lógica para previsualizar y seleccionar modos de transporte.
- `navigation-ui-isolation`: Sistema de gestión de visibilidad de UI basado en el estado de navegación.
- `dynamic-map-centering`: Control de recentrado basado en la interacción del usuario con el mapa durante la navegación.

### Modified Capabilities
- `navigation-system`: Extensión para soportar el modo de transporte `bicycle` y mejorar el formato de los metadatos de la ruta (duración).
- `map-aesthetic-control`: Actualización del puntero de usuario para incluir indicadores de orientación (heading).

## Impact

- **Mobile App**: Cambios significativos en `MapIndexPage`, `NavigationInfo`, y el sistema de gestión de cámara.
- **Services**: Actualización de `navigationService` para incluir nuevos perfiles de coste de Valhalla.
- **Stores**: Ampliación de `useNavigationStore` y `useMapUIStore` para manejar estados de planificación y seguimiento de usuario.
