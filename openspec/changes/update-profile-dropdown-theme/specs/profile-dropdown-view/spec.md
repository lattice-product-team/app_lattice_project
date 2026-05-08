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

### Requirement: Acciones de Control Superiores
El panel SHALL incluir un botón de configuración (engranaje) en la parte superior izquierda y un botón de cierre (X) en la parte superior derecha.

#### Scenario: Cierre del Perfil
- **WHEN** el usuario pulsa el botón (X)
- **THEN** la "Island" debe volver a su estado compacto (Nivel 1 o Cerrado)
- **THEN** el contenido del perfil debe desvanecerse.
