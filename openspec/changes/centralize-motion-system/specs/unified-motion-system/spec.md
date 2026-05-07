## ADDED Requirements

### Requirement: Centralización de Física de Muelle

El sistema DEBE proveer un conjunto de tokens de movimiento (`motion.physics`) accesibles a través del tema de la aplicación. Estos tokens DEBEN cubrir los casos de uso comunes (pesado, responsivo, rápido, suave).

#### Scenario: Acceso a tokens desde el tema

- **WHEN** un desarrollador accede al objeto `theme`
- **THEN** DEBE poder utilizar `theme.motion.physics.magnetic` para configurar una animación `withSpring`.

### Requirement: Consistencia en Componentes de Mapa

Todos los componentes que involucren paneles deslizantes o elementos táctiles en el mapa DEBEN utilizar exclusivamente los tokens definidos en el tema, eliminando cualquier configuración local.

#### Scenario: Uso de token magnetic

- **WHEN** el panel de búsqueda principal realiza una transición
- **THEN** DEBE utilizar la configuración de física definida en `motion.physics.magnetic`.
