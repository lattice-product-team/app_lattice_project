## ADDED Requirements

### Requirement: Domain-Driven Structure
La documentación del proyecto Lattice SHALL estar organizada exclusivamente bajo los siguientes dominios de nivel superior en la carpeta `/docs`:
- `architecture/`: Documentación técnica de diseño, diagramas y flujos.
- `api/`: Especificaciones de servicios, contratos y endpoints.
- `guides/`: Manuales de configuración, tutoriales y despliegue.
- `product/`: Definición de negocio, Pitch, User Journeys y visión.
- `engineering/`: Estándares de calidad, guías de código y procesos internos.

#### Scenario: Verify domain organization
- **WHEN** el script de sincronización se ejecuta
- **THEN** los archivos deben estar clasificados en estas 5 carpetas semánticas sin prefijos alfabéticos

### Requirement: Clean Routing Migration
Todos los archivos originalmente nombrados como `README.md` dentro de las carpetas de documentación SHALL ser renombrados a `index.mdx` durante la migración para garantizar URLs limpias.

#### Scenario: Successful URL mapping
- **WHEN** un usuario accede a `/docs/architecture/`
- **THEN** el sistema debe servir el contenido del archivo `src/pages/architecture/index.mdx`

### Requirement: Standardized MDX Extension
Todos los archivos de documentación (originalmente `.md`) SHALL ser convertidos al formato `.mdx` para habilitar el uso de componentes React en el futuro.

#### Scenario: File extension validation
- **WHEN** se revisa el directorio `src/pages` tras la sincronización
- **THEN** no deben existir archivos con extensión `.md`, solo `.mdx` y `.json`

### Requirement: Sidebar Domain Hierarchy
El sidebar de la web de documentación SHALL reflejar la nueva jerarquía de dominios, eliminando cualquier referencia a las antiguas letras (a-j).

#### Scenario: Sidebar visual check
- **WHEN** se carga la página principal de documentación
- **THEN** el menú de navegación debe mostrar los nombres de los 5 dominios profesionales como secciones principales
