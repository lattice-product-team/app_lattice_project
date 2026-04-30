## ADDED Requirements

### Requirement: Acceso Programático al Nivel 3
El sistema SHALL permitir la transición al Nivel 3 (Pantalla Completa) únicamente mediante disparadores de código específicos.

#### Scenario: Transición por Búsqueda
- **WHEN** el usuario hace focus en la barra de búsqueda o envía una consulta
- **THEN** la "Island" debe transicionar suavemente al valor de estado 1.0 (Nivel 3)

#### Scenario: Transición por Selección de POI
- **WHEN** el usuario selecciona un punto de interés o evento en el mapa
- **THEN** la "Island" debe transicionar suavemente al valor de estado 1.0 (Nivel 3)

### Requirement: Estética de Pantalla Completa en Nivel 3
Cuando el estado es 1.0, la "Island" debe cubrir el ancho total de la pantalla y ajustarse a una altura máxima que permita visualizar ligeramente el fondo superior.

#### Scenario: Adaptación de Bordes y Márgenes
- **WHEN** el valor de `islandState` progresa de 0.5 a 1.0
- **THEN** los márgenes laterales deben reducirse a 0
- **THEN** el `borderTopLeftRadius` y `borderTopRightRadius` SHALL mantenerse en 32
- **THEN** la altura máxima SHALL ser de `SCREEN_HEIGHT * 0.80`

### Requirement: Visibilidad de Controles Laterales
Los botones del HUD derecho deben ocultarse progresivamente según la altura del desplegable.

#### Scenario: Ocultar Botones en Nivel 3
- **WHEN** el `islandState` es mayor a 0.5
- **THEN** la opacidad de `AdaptiveControlOverlay` debe tender a 0
- **THEN** los botones no deben ser interactuables

### Requirement: Ocultar Dashboard en Nivel 3
El contenido del Nivel 2 (DiscoveryDashboard) SHALL desvanecerse progresivamente al entrar en el Nivel 3 para evitar ruido visual.

#### Scenario: Desvanecimiento del Dashboard
- **WHEN** el `islandState` es mayor a 0.5
- **THEN** la opacidad de `DiscoveryDashboard` debe reducirse hasta 0
- **THEN** el componente debe dejar de ocupar espacio (display none) cuando sea totalmente invisible

### Requirement: Oscurecimiento de Fondo (Background Dimming)
El sistema SHALL oscurecer el fondo progresivamente cuando la "Island" transicione al Nivel 3 para mejorar el contraste del contenido detallado.

#### Scenario: Activación de Dimming
- **WHEN** el `islandState` aumenta de 0.5 hacia 1.0
- **THEN** una capa de oscurecimiento debe aparecer sobre el mapa
- **THEN** la opacidad de dicha capa debe alcanzar un máximo de 0.6 al llegar al estado 1.0

### Requirement: Cierre Automático de Teclado
El sistema SHALL cerrar el teclado virtual cuando el usuario interactúe con cualquier elemento de la interfaz fuera del campo de búsqueda.

#### Scenario: Deseleccionar Buscador al Pulsar el Mapa
- **WHEN** el teclado está abierto y el buscador tiene el foco
- **WHEN** el usuario pulsa en el mapa o en la capa de oscurecimiento de fondo
- **THEN** el teclado debe cerrarse inmediatamente

### Requirement: Retorno Dinámico al Desenfocar
El sistema SHALL restaurar el nivel previo de la "Island" cuando el buscador pierda el foco si no hay un elemento seleccionado.

#### Scenario: Restaurar Nivel Pre-Búsqueda
- **WHEN** la "Island" está en Nivel 3 debido al foco en el buscador
- **WHEN** el buscador pierde el foco (blur) por interacción externa
- **THEN** la "Island" debe volver al nivel en el que estaba antes de iniciar la búsqueda (0 o 0.5)

### Requirement: Retorno Progresivo al Nivel 2
Al abandonar el Nivel 3 por acción del usuario, el sistema debe volver al estado de descubrimiento.

#### Scenario: Cierre de Detalle
- **WHEN** el usuario pulsa el botón de cerrar o deselecciona un POI estando en Nivel 3
- **THEN** la "Island" debe volver mediante una animación de spring al valor 0.5 (Nivel 2)
