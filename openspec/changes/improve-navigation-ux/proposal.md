## Why

El sistema de navegación actual es funcional pero carece de la fluidez y el control esperados en una aplicación premium. Actualmente, la navegación se inicia sin permitir al usuario elegir su medio de transporte, la interfaz se siente congestionada durante la conducción y la gestión del centrado del mapa tras una exploración manual es inexistente.

## What Changes

- **Planificador de Ruta (Route Planner)**: Introducción de un paso intermedio antes de iniciar la navegación para seleccionar el modo de transporte (Coche, Caminar). La selección se ubicará en la parte superior y la ruta se previsualizará en el mapa.
- **Puntero de Dirección (Heading Indicator)**: Mejora visual del puntero de usuario para indicar la orientación real (brújula) del dispositivo.
- **Formato de Tiempo Mejorado**: Ajuste de las etiquetas de duración para mostrar horas y minutos cuando el trayecto supera los 60 minutos.

## Capabilities

### New Capabilities

- `route-planner`: Interfaz (superior) y lógica para previsualizar y seleccionar modos de transporte.
- `navigation-ui-isolation`: Sistema de gestión de visibilidad de UI basado en el estado de navegación.
- `dynamic-map-centering`: Control de recentrado basado en la interacción del usuario con el mapa durante la navegación.

### Modified Capabilities

- `navigation-system`: Mejora del formato de los metadatos de la ruta (duración) y ajuste de perfiles de transporte.
- `map-aesthetic-control`: Actualización del puntero de usuario para incluir indicadores de orientación (heading).

## Impact

- **Mobile App**: Cambios significativos en `MapIndexPage`, `NavigationInfo`, y el sistema de gestión de cámara.
- **Services**: Actualización de `navigationService` para incluir nuevos perfiles de coste de Valhalla.
- **Stores**: Ampliación de `useNavigationStore` y `useMapUIStore` para manejar estados de planificación y seguimiento de usuario.
