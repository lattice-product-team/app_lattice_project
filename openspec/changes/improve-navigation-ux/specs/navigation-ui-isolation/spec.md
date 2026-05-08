## ADDED Requirements

### Requirement: Ocultación de Elementos de UI
El sistema SHALL ocultar la barra de búsqueda y los controles adaptativos (HUD lateral) cuando la navegación esté activa (`isNavigating === true`).

#### Scenario: Entrada en modo navegación
- **WHEN** el usuario inicia una ruta confirmada
- **THEN** la barra de búsqueda superior y el panel lateral de controles (3D, Recenter) desaparecen con una animación de salida
