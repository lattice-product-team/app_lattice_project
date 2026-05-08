## ADDED Requirements

### Requirement: Perfil como Desplegable de Nivel 2
El sistema SHALL mostrar la interfaz de perfil como un panel desplegable que ocupa el 50% de la pantalla (Nivel 2), integrado en la arquitectura de "Interactive Island".

#### Scenario: Apertura del Perfil
- **WHEN** el usuario pulsa en su avatar o navega a la ruta de perfil
- **THEN** la "Island" debe transicionar al valor 0.5 (Nivel 2)
- **THEN** el contenido del `ProfileDropdown` debe hacerse visible mediante una animación de opacidad

### Requirement: Layout de Gamificación y Estadísticas
La interfaz de perfil SHALL incluir elementos de gamificación centralizados: Nivel del usuario, barra de progreso porcentual, y tarjetas de estadísticas diarias.

#### Scenario: Visualización de Progreso
- **WHEN** el perfil está expandido en Nivel 2
- **THEN** se debe mostrar el nivel actual (ej: "Lv. 4") y una barra de progreso que refleje el porcentaje completado hacia el siguiente nivel.

### Requirement: Expansión a Nivel 3 para Detalles
El sistema SHALL permitir al usuario expandir el panel de perfil de Nivel 2 (50%) a Nivel 3 (80%+) mediante un gesto de arrastre hacia arriba para visualizar contenido adicional.

#### Scenario: Expansión a Pantalla Completa
- **WHEN** el usuario arrastra el panel hacia arriba desde el Nivel 2
- **THEN** el panel debe transicionar suavemente al Nivel 3
- **THEN** la sección de "Achievements" y medallas debe hacerse completamente visible.
