## ADDED Requirements

### Requirement: Controles del Mapa (HUD) Estilo Apple
El sistema SHALL agrupar los controles principales del mapa (2D/3D, Recentrar, Prismáticos) en un único contenedor vertical con estética de vidrio esmerilado.

#### Scenario: Diseño de Píldora HUD
- **WHEN** se renderiza el `AdaptiveControlOverlay`
- **THEN** debe utilizar un único contenedor con un `borderRadius` de al menos 25px
- **THEN** debe incluir líneas divisorias horizontales entre cada acción

### Requirement: Usabilidad Táctil del HUD
Cada elemento de control dentro del HUD SHALL tener un área de interacción optimizada para evitar errores de pulsación.

#### Scenario: Área de Impacto
- **WHEN** el usuario interactúa con un botón del HUD
- **THEN** el área táctil (`Pressable`) debe cubrir el ancho total del contenedor (mínimo 50px)
- **THEN** la altura de cada sección debe ser de al menos 48px

### Requirement: Alineación de Controles HUD
Los iconos y el texto dentro del HUD SHALL estar perfectamente centrados tanto horizontal como verticalmente.

#### Scenario: Centrado Visual
- **WHEN** se visualizan los controles
- **THEN** el texto "2D/3D" y los iconos de navegación deben estar alineados en el eje central vertical del contenedor
