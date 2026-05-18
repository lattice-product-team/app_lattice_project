## ADDED Requirements

### Requirement: Modal de Planificación de Ruta

El sistema SHALL mostrar un modal de planificación (`RoutePlanningSheet`) antes de iniciar la navegación, permitiendo al usuario elegir el modo de transporte.

#### Scenario: Apertura del planificador

- **WHEN** el usuario pulsa en "Directions" (Direcciones) en un POI o Evento
- **THEN** se muestra el `RoutePlanningSheet` con las opciones de transporte (Coche, Caminar, Bicicleta)

### Requirement: Selección de Modo de Transporte

El sistema SHALL permitir al usuario seleccionar entre los modos `auto` (coche), `pedestrian` (caminar) y `bicycle` (bicicleta).

#### Scenario: Cambio de modo

- **WHEN** el usuario selecciona el icono de "Bicicleta" en el planificador
- **THEN** el sistema solicita una nueva ruta a Valhalla usando el perfil de coste `bicycle` y actualiza los tiempos estimados
